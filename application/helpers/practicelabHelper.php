<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
* LimeSurvey
* Copyright (C) 2007-2011 The LimeSurvey Project Team / Carsten Schmitz
* All rights reserved.
* License: GNU/GPL License v2 or later, see LICENSE.php
* LimeSurvey is free software. This version may have been modified pursuant
* to the GNU General Public License, and as distributed it includes or
* is derivative of works licensed under the GNU General Public License or
* other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
*
*/

/**
 * General helper class for generating pdf.
 */
class practicelabHelper
{

    /**
     * getPdfLanguageSettings
     *
     * Usage: getPdfLanguageSettings($language)
     *
     * @return array ('pdffont','pdffontsize','lg'=>array('a_meta_charset','a_meta_dir','a_meta_language','w_page')
     * @param string $language : language code for the PDF
     */
    public static function getPracticelabVar()
    {
        $sPublicUrl=Yii::app()->getConfig('publicurl');
        $sHeaderlocationurl=Yii::app()->getConfig('headerlocationurl');
        $sErrorscript=Yii::app()->getConfig('errorscript');
        $sSavescript=Yii::app()->getConfig('savecript');
        $sSubmitscript=Yii::app()->getConfig('submitscript');
#        if(!isset($headerlocationurl) || !$headerlocationurl){
#            if(!isset($thisurl['path']) || (str_replace("/","",$thisurl['path'])==""))
#            {

#                $headerlocationurl=$thisurl['scheme']."://".$thisurl['host']."{$port}/";
#            }
#            else
#            {
#                $headerlocationurl=$thisurl['scheme']."://".$thisurl['host'].$port.dirname($thisurl['path']);
#            }
#        }
        if(!$sErrorscript) 
            $sErrorscript="error";
        if(substr($sErrorscript, -1) !="?" && substr($sErrorscript, -1) !="&"){
         if( strpos($sErrorscript,"?")=== false){
            $sErrorscript.="?";
         }else{
            $sErrorscript.="&";
         }
        }
        if(!$sSavescript) 
            $sSavescript="save";
        // Correction on savescript (adding ? or &)
        if(substr($sSavescript, -1) !="?" && substr($sSavescript, -1) !="&"){
         if( strpos($sSavescript,"?")=== false){
            $sSavescript.="?";
         }else{
            $sSavescript.="&";
         }
        }
        if(!$sSubmitscript) 
            $sSubmitscript="finish";
        // Correction on submits (adding ? or &)
        if(substr($sSubmitscript, -1) !="?" && substr($sSubmitscript, -1) !="&"){
         if( strpos($sSubmitscript,"?")=== false){
            $sSubmitscript.="?";
         }else{
            $sSubmitscript.="&";
         }
        }
        return array('headerlocationurl'=>$sHeaderlocationurl,'errorscript'=>$sErrorscript,'savescript'=>$sSavescript,'submitscript'=>$sSubmitscript);
    }

}
