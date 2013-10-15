<?php
Yii::import('application.helpers.practicelabHelper');
$aPracticelabVar=practicelabHelper::getPracticelabVar();
#header("Location: {$aPracticelabVar['headerlocationurl']}404.php");
$basePath=$aPracticelabVar['rabbitpah'];
if(is_file($basePath."404.php"))
    include_once($basePath."404.php");
else
    header("Location: {$aPracticelabVar['headerlocationurl']}404.php");

