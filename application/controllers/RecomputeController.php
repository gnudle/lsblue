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

class RecomputeController extends LSYii_Controller {

    private $language="";
    private $json=false;
    private $bIsAdmin=false;
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
        $iResponseId=(int)Yii::app()->request->getQuery('srid', 0);
        $bDoNext=(bool)Yii::app()->request->getQuery('next', false);
        $bError=false;
        $sMessage="";
        Yii::app()->loadHelper("common");
        $aSurveyInfo=getSurveyInfo($iSurveyId);

        if(!$aSurveyInfo || $aSurveyInfo['active']!="Y")
        {
            $this->bIsAdmin=true;// Admin view response and can update one by one. Else : only update if token or srid
        }
        Yii::app()->setConfig('surveyID',$iSurveyId);
        $bIsTokenSurvey=tableExists("tokens_{$iSurveyId}");
        if(hasSurveyPermission($iSurveyId,'responses','update'))
        {
            $this->sendError("Invalid user (permissions)");
        }
        $iNextSrid=0;
        if($bIsTokenSurvey && $sToken && !$iResponseId)
        {
            $oResponse=Survey_dynamic::model($iSurveyId)->find("token=:token",array('token'=>$sToken));
            if($oResponse)
                $iResponseId=$oResponse->id;
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
            $_SESSION['survey_'.$iSurveyId]['srid']=$iResponseId;
            $aOldAnswers=$oResponse->attributes;
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
                $_SESSION['survey_'.$iSurveyId]['maxstep'] = $oResponse->lastpage;
                $_SESSION['survey_'.$iSurveyId]['step'] = $oResponse->lastpage;
                $step=$_SESSION['survey_'.$iSurveyId]['step']; // Need movenext after
            }
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
            if(isset($aOldAnswers['lastpage'])){$aSavedAnswers['lastpage']=$aOldAnswers['lastpage'];}
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
            buildsurveysession($iSurveyId);
            foreach($aOldAnswers as $column=>$value){
                if (in_array($column, $_SESSION['survey_'.$surveyid]['insertarray']) && isset($_SESSION['survey_'.$surveyid]['fieldmap'][$column]))
                {
                    $_SESSION['survey_'.$surveyid][$column]=$value;
                }
            }
            LimeExpressionManager::StartSurvey($iSurveyId,$surveyMode,$aEmSurveyOptions);
            $oResponse=Survey_dynamic::model($iSurveyId)->findByPk($iResponseId);
            $aInsertArray=$_SESSION['survey_'.$surveyid]['insertarray'];
            $aFieldMap=$_SESSION['survey_'.$surveyid]['fieldmap'];
            $updatedValues=array();
            $updatedInfoArray=array();
            foreach($aOldAnswers as $column=>$value)
            {
                if (in_array($column,$aInsertArray) && isset($aFieldMap[$column]))
                {
                    Yii::import('application.helpers.viewHelper');
                    $sColumnName=viewHelper::getFieldCode($aFieldMap[$column]);
                    $bRelevance=true;
                    if(Yii::app()->getConfig('deletenonvalues') && isset($aFieldMap[$column]['relevance']) && trim($aFieldMap[$column]['relevance']!=""))
                    {
                        $bRelevance= (bool)LimeExpressionManager::ProcessString("{".$aFieldMap[$column]['relevance']."}");
                        if(!$bRelevance)
                        {
                            
                            if(!is_null($oResponse->$column))
                            {
                                if($oResponse->$column)
                                    $updatedInfoArray[$sColumnName]=$updatedValues['old'][$sColumnName]."=>NULL";
                                $updatedValues['old'][$sColumnName]=$oResponse->$column;
                                $updatedValues['new'][$sColumnName]=null;
                            }
                            $oResponse->$column= null;
                        }
                        
                    }
                    if ($aFieldMap[$column]['type'] == '*' && $bRelevance)
                    {
                        $oldVal=$oResponse->$column;
                        $newVal=$oResponse->$column=LimeExpressionManager::ProcessString($aFieldMap[$column]['question']);
                        if($oldVal!=$newVal && ($oldVal && $newVal))
                        {
                            $updatedValues['old'][$sColumnName]=$oldVal;
                            $updatedValues['new'][$sColumnName]=$newVal;
                            $updatedInfoArray[$sColumnName]=$updatedValues['old'][$sColumnName]."=>".$updatedValues['new'][$sColumnName];
                        }
                    }
                }
            }
            $oResponse->save();
            // Construct a message
            if(count($updatedValues)>1)
                $message= sprintf('Responses %s updated: %s answers modified.',$iResponseId,count($updatedInfoArray));
            elseif(count($updatedValues)>0)
                $message= sprintf('Responses %s updated: one answer modified.',$iResponseId);
            else
                $message= sprintf('Responses %s updated: no answer modified.',$iResponseId);
            if(!$this->bIsAdmin)
                $message= 'Responses %s updated.';
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
            if($this->bIsAdmin)
                $this->json=json_encode(array("status"=>"success","message"=>$message,"next"=>$iNextSrid,"updatedValueCount"=>count($updatedInfoArray),"updatedArray"=>$updatedInfoArray));
            else
                $this->json=json_encode(array("status"=>"success","message"=>$message);
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

}
