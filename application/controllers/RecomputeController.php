<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
 * LimeSurvey RecomputeExpression
 * Copyright (C) 2013 Practice Lab / Denis Chenu
 * All rights reserved.
 * License: GNU/GPL License v2 or later, see LICENSE.php
 * LimeSurvey is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 * See COPYRIGHT.php for copyright notices and details.
 *
 */

/* 
 * A class to recompute expression in ajax or by url 
 * @return json
 * @url_param int $sid survey id (mandatory)
 * @url_param string $token the token of the answer (option)
 * @url_param int srid the id of the answers (option)
 * @url_param bool next Need to send next srid (only for admin)
 * @url_param bool update Allow other url parameters toupdateb the response line. Only if token or for admin
 * @url_param any Question code to be updated
 * 
 */
class RecomputeController extends LSYii_Controller {

    private $language="";
    private $json=false;

    private $bIsAdmin=false; // To test if user is admin
    private $bAllowByResponseId=true; // Allow update by response Id

    private $bToUpdate=false; // Allow anybody to update an answer (if false : only update by token or if admin user allowed to update responses)
    private $bCompleteMessage=true; // Return complete json information (if false : only for admin)

    function init()
    {
        parent::init();
        $app = Yii::app();
        $this->language=Yii::app()->getConfig('defaultlang');
    }

    public function actionIndex()
    {
        Yii::app()->loadHelper("database");
        Yii::app()->loadHelper("frontend");
        Yii::app()->loadHelper("surveytranslator");
        // language
#        $baselang = Yii::app()->getConfig('defaultlang');
#        Yii::import("application.libraries.Limesurvey_lang");
#        $clang = new Limesurvey_lang($this->language);

        $iSurveyId=(int)Yii::app()->request->getQuery('sid', 0);
        $sToken=(string)Yii::app()->request->getQuery('token', "");
        if($this->bAllowByResponseId || $this->bIsAdmin)
            $iResponseId=(int)Yii::app()->request->getQuery('srid', 0);
        else
            $iResponseId=0;
        $bDoNext=(bool)Yii::app()->request->getQuery('next', false);
        $bDoRelevance=(bool)Yii::app()->request->getQuery('relevance',Yii::app()->getConfig('deletenonvalues'));
        $bDoRecompute=(bool)Yii::app()->request->getQuery('recompute',true);// ONLY used if update is false
        $bUpdate=(bool)Yii::app()->request->getQuery('update', false);
        $bForceRecompute=(bool)Yii::app()->request->getQuery('forcerecompute', false);// ONLY used with update to true

        $bError=false;
        $sMessage="";
        Yii::app()->loadHelper("common");
        $aSurveyInfo=getSurveyInfo($iSurveyId);

        if(!$aSurveyInfo || $aSurveyInfo['active']!="Y")
        {
                $this->sendError("Invalid Survey ID");
        }
        Yii::app()->setConfig('surveyID',$iSurveyId);
        $bIsTokenSurvey=tableExists("tokens_{$iSurveyId}");
        if(hasSurveyPermission($iSurveyId,'responses','update'))
        {
            $this->bCompleteMessage=$this->bIsAdmin=true;// Admin view response and can update one by one. Else : only update if token or srid
            if($bUpdate)
                $this->bToUpdate=true;
        }
        $iNextSrid=0;
        if($bIsTokenSurvey && $sToken && !$iResponseId)
        {
            $oResponse=Survey_dynamic::model($iSurveyId)->find("token=:token",array('token'=>$sToken));
            if($oResponse)
                $iResponseId=$oResponse->id;
            $this->bCompleteMessage=true;
            if($bUpdate)
                $this->bToUpdate=true;
        }
        if(!$sToken && !$iResponseId && $bDoNext && $this->bIsAdmin)
        {
            $oResponse=Survey_dynamic::model($iSurveyId)->find("submitdate IS NOT NULL",array("order"=>"id"));
            if($oResponse)
                $iResponseId=$oResponse->id;
            else
                $this->json=json_encode(array("status"=>"success","message"=>"No completed survey found","next"=>false,"updatedValueCount"=>0,"updatedArray"=>array()));
        }
        if($iResponseId){
            $oResponse=Survey_dynamic::model($iSurveyId)->findByPk($iResponseId);
            if(!$oResponse)
            {
                $this->sendError("Invalid Response ID");
            }
            unset($_SESSION['survey_'.$iSurveyId]);
            $aOldAnswers=$oResponse->attributes;// Take the order of the survey ....
            $_SESSION['survey_'.$iSurveyId]['srid']=$iResponseId;
            if(isset($oResponse->startlanguage ) && $oResponse->startlanguage )
            {
                $_SESSION['survey_'.$iSurveyId]['s_lang']=$oResponse->startlanguage;
                SetSurveyLanguage($iSurveyId, $oResponse->startlanguage);//$clang=>Yii->app->lang;
            }
            else
            {
                SetSurveyLanguage($iSurveyId);
            }
            // Fill some global before call loadanswers function
            $surveyid=$iSurveyId;
            $thissurvey=$aSurveyInfo;
            if(isset($oResponse->token) && $oResponse->token)
                $clienttoken=$oResponse->token;
            $rooturl=Yii::app()->baseUrl . '/';
            $step=0;
            if(isset($oResponse->lastpage) && $oResponse->lastpage)
            {
                $_SESSION['survey_'.$iSurveyId]['prevstep']=-1;
                if($oResponse->lastpage>0){
                    $_SESSION['survey_'.$iSurveyId]['maxstep'] = $oResponse->lastpage;
                    $_SESSION['survey_'.$iSurveyId]['step'] = $oResponse->lastpage;
                }else{
                    $_SESSION['survey_'.$iSurveyId]['maxstep'] = 0;
                    $_SESSION['survey_'.$iSurveyId]['step'] = 0;
                }
            }
            $_SESSION['survey_'.$iSurveyId]['LEMtokenResume']=true;
            if($aSurveyInfo['format']=="A"){
                $surveyMode='survey';
            }elseif($aSurveyInfo['format']=="G"){
                $surveyMode='group';
            }else{
                $surveyMode='question';
            }
            $aSavedAnswers=array();
            if(isset($aOldAnswers['datestamp'])){$aSavedAnswers['datestamp']=$aOldAnswers['datestamp'];}
            if(isset($aOldAnswers['submitdate'])){$aSavedAnswers['submitdate']=$aOldAnswers['submitdate'];}
            if(isset($aOldAnswers['lastpage']) && $aOldAnswers['lastpage']>0){
                $aSavedAnswers['lastpage']=$aOldAnswers['lastpage'];
            }else{
                $aSavedAnswers['lastpage']=0;
            }
            $radix=getRadixPointData($aSurveyInfo['surveyls_numberformat']);
            $radix = $radix['seperator'];
            $aEmSurveyOptions = array(
            'active' => ($aSurveyInfo['active'] == 'Y'),
            'allowsave' => ($aSurveyInfo['allowsave'] == 'Y'),
            'anonymized' => ($aSurveyInfo['anonymized'] != 'N'),
            'assessments' => ($aSurveyInfo['assessments'] == 'Y'),
            'datestamp' => ($aSurveyInfo['datestamp'] == 'Y'),
            'deletenonvalues'=>Yii::app()->getConfig('deletenonvalues'),
            'hyperlinkSyntaxHighlighting' => false,
            'ipaddr' => ($aSurveyInfo['ipaddr'] == 'Y'),
            'radix'=>$radix,
            'refurl' => (($aSurveyInfo['refurl'] == "Y" && isset($oResponse->refurl)) ? $oResponse->refurl : NULL),
            'savetimings' => ($aSurveyInfo['savetimings'] == "Y"),
            'surveyls_dateformat' => (isset($aSurveyInfo['surveyls_dateformat']) ? $aSurveyInfo['surveyls_dateformat'] : 1),
            'startlanguage'=>(isset($clang->langcode) ? $clang->langcode : $thissurvey['language']),
            'target' => Yii::app()->getConfig('uploaddir').DIRECTORY_SEPARATOR.'surveys'.DIRECTORY_SEPARATOR.$thissurvey['sid'].DIRECTORY_SEPARATOR.'files'.DIRECTORY_SEPARATOR,
            'tempdir' => Yii::app()->getConfig('tempdir').DIRECTORY_SEPARATOR,
            'timeadjust' => 0,
            'token' => (isset($clienttoken) ? $clienttoken : NULL),
            );
            LimeExpressionManager::SetDirtyFlag();
            buildsurveysession($iSurveyId);// Keep the order ....
            $this->loadAnswers($iSurveyId,$iResponseId);
            $updatedValues=array();
            $updatedInfoArray=array();
            $aInsertArray=$_SESSION['survey_'.$surveyid]['insertarray'];
            $aFieldMap=$_SESSION['survey_'.$surveyid]['fieldmap'];
            Yii::import('application.helpers.viewHelper');

            $aTempAnswers=$aOldAnswers;
            $aReservedVar=array('token','srid','sid','next','update');
            if($this->bToUpdate){
                foreach($aOldAnswers as $column=>$value)
                {
                    if (in_array($column,$aInsertArray) && isset($aFieldMap[$column]))
                    {
                        $sColumnName=viewHelper::getFieldCode($aFieldMap[$column],array('LEMcompat'=>true));
                        if (!in_array($sColumnName,$aReservedVar) && $newValue=Yii::app()->request->getQuery($sColumnName))
                        {
                            $aTempAnswers[$column] = $newValue;
                            $updatedValues['old'][$sColumnName]=$oResponse->$column;
                            $updatedValues['new'][$sColumnName]=$newValue;
                            if(!is_null($oResponse->$column))
                                $updatedInfoArray[$sColumnName]=$updatedValues['old'][$sColumnName]."=>".$newValue;
                            else
                                $updatedInfoArray[$sColumnName]='NULL'."=>".$newValue;
                            $oResponse->$column=$newValue;
                            
                        }
                    }
                }
                $oResponse->save();
                LimeExpressionManager::SetDirtyFlag();
                buildsurveysession($iSurveyId);
                $this->loadAnswers($iSurveyId,$iResponseId);
            }
            $oResponse=Survey_dynamic::model($iSurveyId)->findByPk($iResponseId);
            $_SESSION['survey_'.$surveyid]['srid'] = $oResponse->id;
            $_SESSION['survey_'.$surveyid]['LEMtokenResume'] = true;
            $_SESSION['survey_'.$surveyid]['maxstep'] = $_SESSION['survey_'.$surveyid]['totalsteps']+1;
            $_SESSION['survey_'.$surveyid]['step'] = $_SESSION['survey_'.$surveyid]['totalsteps']+1;
            LimeExpressionManager::StartSurvey($iSurveyId,$surveyMode,$aEmSurveyOptions);
            LimeExpressionManager::JumpTo($_SESSION['survey_'.$surveyid]['totalsteps']+1,false,false,true) ;// To set all relevanceStatus
            // Fix parameters according to $bUpdate
            if($bUpdate && !$bForceRecompute){
                $bDoRelevance=$bDoRecompute=false;
            }
#           $updatedInfoArray['debugfirst'] = LimeExpressionManager::ProcessString("DEBUG{ixCioExistsNcY}");
#           $updatedInfoArray['debugsecond'] = LimeExpressionManager::ProcessString("DEBUG{if(ixCioExistsNcY=='Y','OK','BAD')}");
#            echo "<pre>".var_export($_SESSION['survey_'.$surveyid],true)."</pre>";
#            $debugCnt=0;
            foreach($aOldAnswers as $column=>$value)
            {

                $sColumnName=viewHelper::getFieldCode($aFieldMap[$column],array('LEMcompat'=>true));
                if (in_array($column,$aInsertArray) && isset($aFieldMap[$column]))
                {
                    $bRelevance=true;
#                    $updatedInfoArray['debug'.$debugCnt]=LimeExpressionManager::ProcessString("{ixCioExistsNcY}");
#                    $debugCnt++;
                    $sRelevance=isset($aFieldMap[$column]['relevance'])?trim($aFieldMap[$column]['relevance']):1;
                    $bRelevance= (bool)LimeExpressionManager::ProcessString("{".$sRelevance."}");
                    if($bDoRelevance && $sRelevance!="" && $sRelevance!="1" )
                    {
                        // We need to fix column for multiple question : todo : attribute filter
                        if(isset($_SESSION['survey_'.$surveyid]['fieldnamesInfo'][$column]) && $_SESSION['survey_'.$surveyid]['fieldnamesInfo'][$column]!=$column)
                        {
                            $sParentSGQ=$_SESSION['survey_'.$surveyid]['fieldnamesInfo'][$column];
                            $aParentSGQ=explode('X',$sParentSGQ);
                            if(isset($aParentSGQ[2]))
                            {
                                $oParentQuestion=Questions::model()->find('qid=:qid and language=:language',array(':qid'=>$aParentSGQ[2],':language'=>$thissurvey['language']));
                                if($oParentQuestion)
                                {
                                    $sRelevance=trim($oParentQuestion->relevance);
                                    $bRelevance= (bool)LimeExpressionManager::ProcessString("{".$sRelevance."}");
                                }
                            }
                        }
                        if(!$bRelevance)
                        {
                            if(!is_null($oResponse->$column))
                            {
                                $updatedValues['old'][$sColumnName]=$oResponse->$column;
                                $updatedValues['new'][$sColumnName]=null;
                                if($oResponse->$column){
                                    $updatedInfoArray[$sColumnName]=$updatedValues['old'][$sColumnName]."=>NULL";
                                }
                            }
                            $oResponse->$column= null;
                            // Set relevanceStatus to false
                            $_SESSION['survey_'.$surveyid][$column]=NULL;
                            $_SESSION['survey_'.$surveyid]['relevanceStatus'][$aFieldMap[$column]['qid']]=false;
                        }
                        else
                        {
                            $_SESSION['survey_'.$surveyid]['relevanceStatus'][$aFieldMap[$column]['qid']]=true;
                        }
                    }
                    if ($bDoRecompute && $aFieldMap[$column]['type'] == '*' && $bRelevance)
                    {
                        $oldVal=$oResponse->$column;
                        $newVal=$oResponse->$column=LimeExpressionManager::ProcessString($aFieldMap[$column]['question'],$aFieldMap[$column]['qid'],array(),false,3,1,false,true,true);
                        if($oldVal!==$newVal)
                        {
                            if(!is_null($oldVal))
                                $updatedValues['old'][$sColumnName]=$oldVal;
                            else
                                $updatedValues['old'][$sColumnName]="NULL";
                            $updatedValues['new'][$sColumnName]=$newVal;
                            $updatedInfoArray[$sColumnName]=$updatedValues['old'][$sColumnName]."=>".$updatedValues['new'][$sColumnName];
                            $_SESSION['survey_'.$surveyid][$column]=$newVal;
                        }
                    }
                }
            }
            $oResponse->save();
            foreach($aSavedAnswers as $column => $value)
            {
                $oResponse->$column=$value;
            }
            $oResponse->save();
            // Construct a message
            if(count($updatedValues)>1)
                $message= sprintf('Responses %s updated: %s answers modified.',$iResponseId,count($updatedInfoArray));
            elseif(count($updatedValues)>0)
                $message= sprintf('Responses %s updated: one answer modified.',$iResponseId);
            else
                $message= sprintf('Responses %s updated: no answer modified.',$iResponseId);
            if(!$this->bCompleteMessage)
                $message=  sprintf('Responses %s updated.',$iResponseId);
            // If needed find the next
            if($bDoNext)
            {
                $oNextResponse=Survey_dynamic::model($iSurveyId)->find(array(
                                                                    'select'=>'id',
                                                                    'condition'=>'id>:id AND submitdate IS NOT NULL',
                                                                    'params'=>array('id'=>$iResponseId),
                                                                    'order'=>'id',
                                                                ));
                if($oNextResponse)
                    $iNextSrid=$oNextResponse->id;
            }
            if($this->bCompleteMessage)
                $this->json=json_encode(array("status"=>"success","message"=>$message,"next"=>$iNextSrid,"updatedValueCount"=>count($updatedInfoArray),"updatedArray"=>$updatedInfoArray));
            else
                $this->json=json_encode(array("status"=>"success","message"=>$message));
        }
        $this->displayJson();
    }

    private function sendError($message="An error was occured")
    {
        $this->json=json_encode(array("status"=>"error","message"=>$message,"next"=>false,"updatedValueCount"=>0));
        $this->displayJson();
    }
    private function displayJson()
    {
        if($this->json)
        {
            header('Content-type: application/json');
            echo $this->json;
            die();
        }
        else
        {
            die("An error was occured");
        }
    }
    private function loadAnswers($surveyid,$iResponseId)
    {
        if(isset($_SESSION['survey_'.$surveyid]['s_lang']))
        {
            $thissurvey=getSurveyInfo($surveyid,$_SESSION['survey_'.$surveyid]['s_lang']);
        }
        else
        {
            $thissurvey=getSurveyInfo($surveyid);
        }
        $oResponse=Survey_dynamic::model($surveyid)->findByPk($iResponseId);
        foreach ($oResponse->attributes as $column => $value)
        {
            if (in_array($column, $_SESSION['survey_'.$surveyid]['insertarray']) && isset($_SESSION['survey_'.$surveyid]['fieldmap'][$column]))
            {
                if (($_SESSION['survey_'.$surveyid]['fieldmap'][$column]['type'] == 'N' ||
                $_SESSION['survey_'.$surveyid]['fieldmap'][$column]['type'] == 'K' ||
                $_SESSION['survey_'.$surveyid]['fieldmap'][$column]['type'] == 'D') && $value == null)
                {
                    $_SESSION['survey_'.$surveyid][$column]='';
                }
                else
                {
                    $_SESSION['survey_'.$surveyid][$column]=$value;
                }
            }
        }
    }
}
