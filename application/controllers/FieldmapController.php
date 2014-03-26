<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
 * LimeSurvey
 * Copyright (C) 2007-2011 The LimeSurvey Project Team / Carsten Schmitz
 * Copyright (C) 2014 Denis Chenu <http://sondages.pro>
 * Copyright (C) 2014 Practice lab
 * All rights reserved.
 * License: GNU/GPL License v2 or later, see LICENSE.php
 * LimeSurvey is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 * See COPYRIGHT.php for copyright notices and details.
 *
 */
class FieldmapController extends LSYii_Controller {

    private $language="";
    function init()
    {
        parent::init();
    }

    public function actionIndex()
    {
        Yii::import('application.helpers.common_helper', true);
        Yii::import('application.libraries.Limesurvey_lang', true);
        $iSurveyId=Yii::app()->request->getQuery('sid', 0);

		/* check api token */
		$apiToken=Yii::app()->request->getQuery('t', 0);
		if ($apiToken=="" or $apiToken != getenv('CRON_API_TOKEN')) {
			echo "Access denied";
			exit ();
				}

        $oSurvey=Survey::model()->find('sid=:sid',array(':sid'=>$iSurveyId));
        if($oSurvey){
            LimeExpressionManager::SetSurveyId($iSurveyId);
            SetSurveyLanguage( $iSurveyId, $oSurvey->language);
            $aFieldsMap=createFieldMap($iSurveyId,'short',false,false,$oSurvey->language);
        }
        else
            $aFieldsMap=array();
        header('Content-type: application/json');
        echo json_encode($aFieldsMap);
    }


}
