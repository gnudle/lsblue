<div id='publication'><ul>


            <li><label for='public'><?php $clang->eT("List survey publicly:");?></label>
            <select id='public' name='public'>
            <option value='Y'
        <?php if (!isset($esrow['listpublic']) || !$esrow['listpublic'] || $esrow['listpublic'] == "Y") { ?>
              selected='selected'
        <?php } ?>
             ><?php $clang->eT("Yes"); ?></option>
            <option value='N'
        <?php if (isset($esrow['listpublic']) && $esrow['listpublic'] == "N") { ?>
              selected='selected'
        <?php } ?>
             ><?php $clang->eT("No"); ?></option>
            </select>
            </li>

        <li><label for='threshold'><?php $clang->eT("Threshold:") ?></label>
            <?php echo CHtml::textField('threshold', $esrow['threshold'], array('size'=>'12','maxlength'=>'12','pattern'=>'\d*')); ?>
        </li>
        
        <?php $aRowArray=array("Y"=>$clang->gT("Yes"),"N"=>$clang->gT("No")); 
            if(!array_key_exists($esrow['published'],$aRowArray))
                $esrow['published']="N";// default value
        ?>
        <li><label for='published'><?php $clang->eT("Publish survey results:") ?></label>
            <?php echo CHtml::dropDownList('published', $esrow['published'], $aRowArray); ?>
        </li>

        <?php $aRowArray=array("Y"=>$clang->gT("Year"),"Q"=>$clang->gT("Quarter"),"M"=>$clang->gT("Month"),"W"=>$clang->gT("Week"),"D"=>$clang->gT("Day")); 
            if(!array_key_exists($esrow['period_unit'],$aRowArray))
                $esrow['period_unit']="Y";// default value
        ?>
        <li><label for='period_unit'><?php $clang->eT("Period Unit:") ?></label>
            <?php echo CHtml::dropDownList('period_unit', $esrow['period_unit'], $aRowArray); ?>
        </li>

        <?php $aRowArray=array("O"=>$clang->gT("Open"),"C"=>$clang->gT("Closed"),"S"=>$clang->gT("Screened")); 
            if(!array_key_exists($esrow['admission'],$aRowArray))
                $esrow['admission']="C";// default value
        ?>
        <li><label for='admission'><?php $clang->eT("Admission restrictions:") ?></label>
            <?php echo CHtml::dropDownList('admission', $esrow['admission'], $aRowArray); ?>
        </li>

        <?php $aRowArray=array("Y"=>$clang->gT("Yes"),"N"=>$clang->gT("No")); 
            if(!array_key_exists($esrow['mobile'],$aRowArray))
                $esrow['mobile']="N";// default value
        ?>
        <li><label for='mobile'><?php $clang->eT("Mobile survey?") ?></label>
            <?php echo CHtml::dropDownList('mobile', $esrow['mobile'], $aRowArray); ?>
        </li>

             <li><label for='startdate'><?php $clang->eT("Start date/time:"); ?></label>
            <input type='text' class='popupdatetime' id='startdate' size='20' name='startdate' value="<?php echo $startdate; ?>" /></li>

            <!--// Expiration date
            $expires='';
        if (trim($esrow['expires']) != '') {
                $items = array($esrow['expires'] , "Y-m-d H:i:s");
                $this->load->library('Date_Time_Converter',$items);
                $datetimeobj = $this->date_time_converter; //new Date_Time_Converter($esrow['expires'] , "Y-m-d H:i:s");
                $expires=$datetimeobj->convert($dateformatdetails['phpdate'].' H:i');
            } -->
             <li><label for='expires'><?php $clang->eT("Expiry date/time:"); ?></label>
             <input type='text' class='popupdatetime' id='expires' size='20' name='expires' value="<?php echo $expires; ?>" /></li>


             <li><label for='usecookie'><?php $clang->eT("Set cookie to prevent repeated participation?"); ?></label>
            <select name='usecookie' id='usecookie'>
            <option value='Y'
        <?php if ($esrow['usecookie'] == "Y") { ?>
              selected='selected'
        <?php } ?>
             ><?php $clang->eT("Yes"); ?></option>
            <option value='N'
        <?php if ($esrow['usecookie'] != "Y") { ?>
              selected='selected'
        <?php } ?>
             ><?php $clang->eT("No"); ?></option>
             </select>
             </li>


             <li><label for='usecaptcha'><?php $clang->eT("Use CAPTCHA for"); ?>:</label>
             <select name='usecaptcha' id='usecaptcha'>
             <option value='A'
        <?php if ($esrow['usecaptcha'] == "A") { ?>
              selected='selected'
        <?php } ?>
             ><?php $clang->eT("Survey Access"); ?> / <?php $clang->eT("Registration"); ?> / <?php echo$clang->gT("Save & Load"); ?></option>
            <option value='B'
        <?php if ($esrow['usecaptcha'] == "B") { ?>
              selected='selected'
        <?php } ?>

             ><?php $clang->eT("Survey Access"); ?> / <?php $clang->eT("Registration"); ?> / ---------</option>
            <option value='C'
        <?php if ($esrow['usecaptcha'] == "C") { ?>
              selected='selected'
        <?php } ?>

             ><?php $clang->eT("Survey Access"); ?> / ------------ / <?php $clang->eT("Save & Load"); ?></option>
            <option value='D'
        <?php if ($esrow['usecaptcha'] == "D") { ?>
              selected='selected'
        <?php } ?>

             >------------- / <?php $clang->eT("Registration"); ?> / <?php $clang->eT("Save & Load"); ?></option>
            <option value='X'

        <?php if ($esrow['usecaptcha'] == "X") { ?>
              selected='selected'
        <?php } ?>

             ><?php $clang->eT("Survey Access"); ?> / ------------ / ---------</option>
            <option value='R'
        <?php if ($esrow['usecaptcha'] == "R") { ?>
              selected='selected'
        <?php } ?>
             >------------- / <?php $clang->eT("Registration"); ?> / ---------</option>
            <option value='S'
        <?php if ($esrow['usecaptcha'] == "S") { ?>
              selected='selected'
        <?php } ?>
             >------------- / ------------ / <?php $clang->eT("Save & Load"); ?></option>
            <option value='N'
        <?php if ($esrow['usecaptcha'] == "N") { ?>
              selected='selected'";
        <?php } ?>
             >------------- / ------------ / ---------</option>
            </select></li>

        </ul></div>
