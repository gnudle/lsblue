/*
 * LimeSurvey
 * Copyright (C) 2007 The LimeSurvey Project Team / Carsten Schmitz
 * All rights reserved.
 * License: GNU/GPL License v2 or later, see LICENSE.php
 * LimeSurvey is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 * See COPYRIGHT.php for copyright notices and details.
 * 
 * 
 * Description: Javascript file for templates. Put JS-functions for your template here.
 *  
 * 
 * $Id:$
 */
String.prototype.endsWith = function (s) {
  return this.length >= s.length && this.substr(this.length - s.length) == s;
}

function alert(text){
  alertDiv = document.createElement("div");
  alertDiv.innerHTML = text;
  if($("#alert-block").hasClass("done")){
    $("#container").notify("create", {
        title: '',
        text: text
        },{
        stack: 'below',
        speed: 1000,
        expires: -1
        });
  }else{
    container_div = document.getElementById("alert-block").appendChild(alertDiv);
  }
}
function htmlEncode(value){
    if (value) {
        return jQuery('<div />').text(value).html();
    } else {
        return '';
    }
}

/*
 * The function focusFirst puts the Focus on the first non-hidden element in the Survey. 
 * 
 * Normally this is the first input field (the first answer).
 */
function focusFirst(Event)
{
	firstinputid=$('#limesurvey .survey-question:visible:first input.text:visible,#limesurvey .survey-question:visible:first textarea:visible').eq(0).attr("id");
	if($("#"+firstinputid).closest(".other").length){
	}else{
	    $("#"+firstinputid).focus();
	}
}
/*
 * The focusFirst function is added to the eventlistener, when the page is loaded.
 * 
 * This can be used to start other functions on pageload as well. Just put it inside the 'ready' function block
 */
// Add empty class to input text and textarea
function addClassEmpty(){

      $('.mandatory input.text[value=""]').addClass('empty');
      $('.mandatory input[type=text][value=""]').addClass('empty');
      $('.mandatory textarea').each(function(index) {
        if ($(this).val() == ""){
          $(this).addClass('empty');
        }
      });

    $("#survey-wrapper").delegate("input.text,input[type=text]","focusout", function(){ 
      if ($(this).val() == ""){
        $(this).addClass('empty');
      }else{
        $(this).removeClass('empty');
        $(this).closest('.input-error').removeClass('input-error');
        cellid=$(this).closest('.cell-error').attr('id');
        $(this).qtip('destroy');
        if($(this).closest('.cell-error').find('.text.empty').length<1)
        {
            $(this).closest('.cell-error').removeClass('cell-error');
        }
      }
    });
    $("#survey-wrapper").delegate("textarea","focusout", function(){ 
      if ($(this).val() == ""){
        $(this).addClass('empty');
      }else{
        $(this).removeClass('empty');
        $(this).closest('.input-error').removeClass('input-error');
        cellid=$(this).closest('.cell-error').attr('id');
        $(this).qtip('destroy');
        if($(this).closest('.cell-error').find('.text.empty').length<1)
        {
            $(this).closest('.cell-error').removeClass('cell-error');
        }
      }
    });
}
function navbuttonsJqueryUi(){
}
function nosmartphone()
{
    if($("#nosmartphone").length>0)
    {
        if(screen.width<600){
            $("#survey-wrapper").append("<div class='alert alert-info'><p>We noticed you are using a smartphone.</p><p>Unfortunately, this survey contains tables that are just too wide to display correctly on your phone, so we recommend you log in on a computer with a larger screen when it's convenient.</div>");
            if($("#nosmartphone.remove").length>0)
            {
                $(".survey-main").remove();
                $("#progress-wrapper").remove();
            }
        }
    }
}
function navButtons(){
   //Replace default jquery-ui button
   $("form").each(function(){
     if($(this).attr("action").length){
      $(this).attr('action',$(this).attr('action').replace("index.php",""))
     }
   });
   $("#official-navigator").hide();
   if($(".survey-welcome").length>0 ){ $("#navigator_top").hide(); }
   $('#index input.submit').addClass('saveall');
   navigatorhtml="";
   whitenavigatorhtml="";
   if($("#moveprevbtn").length>0 )
   {
        moveprevbuttonttext=$("#moveprevbtn").attr("value").replace("<< ","< ");
        navigatorhtml=navigatorhtml+'<button class="moveprevbutton">'+moveprevbuttonttext+'</button> ';
        whitenavigatorhtml=whitenavigatorhtml+'<button class="moveprevbutton">'+moveprevbuttonttext+'</button> ';
    }
   if($("#movenextbtn").length>0)
   {
        movenextbuttontext=$("#movenextbtn").attr("value").replace(" >>"," >");
        movenextbigbuttontext=$("#movenextbtn").attr("value").replace(" >>","");
        navigatorhtml=navigatorhtml+'<button class="movenextbutton" id="movenextbtnbis">'+movenextbuttontext+'</button>';
        if($("#index input.submit").length>0 && false){
        whitenavigatorhtml=whitenavigatorhtml+'<button class="movenextsubmitbutton" id="movenextbtnbis">'+$("#index input.submit").attr("value")+'</button>';}
        else{
        whitenavigatorhtml=whitenavigatorhtml+'<button class="movenextbutton" id="movenextbtnbis">'+movenextbigbuttontext+'</button>';}
    }
   if($("#movesubmitbtn").length>0 )
   {
        movesubmitbuttontext=$("#movesubmitbtn").attr("value");
        navigatorhtml=navigatorhtml+'<button class="movesubmitbutton btn-info" id="movesubmitbis">'+movesubmitbuttontext+'</button>';
        whitenavigatorhtml=whitenavigatorhtml+'<button class="movesubmitbutton btn-info" id="movesubmitbis">'+movesubmitbuttontext+'</button>';
    }
   // Add a new navigator inside every element with navigatoralt
    $('.navigatoralt').append(navigatorhtml);
    $('.whitenavigatoralt').append(whitenavigatorhtml);
    // Simulate click with ALL element with class moveXXXbutton
    $(".movenextsubmitbutton").click(function(){$("#index input.submit").click();}); // If the index have a submit button: big button submit
    $(".movenextbutton").click(function(){$("#movenextbtn").click();});
    $(".movesubmitbutton").click(function(){$("#movesubmitbtn").click();});
    $(".moveprevbutton").click(function(){$("#moveprevbtn").click();});
   $(".noprevious .moveprevbutton").hide();
   $(".bignavigator button").addClass("bigbutton");
}
function accordionIndex(){
  if($('#index .container').length > 0){
    $("body").addClass("indexed");
  }
  if( $('#index .container h3').length > 0 )
  {
    // preload image
    $('#index .container h3').each(function(index){
      $(this).addClass("grouptitle");
      $(this).attr("id",'grouptitle-'+index);
      $(this).after("<div class='group' id='groupindex-"+index+"'></div>");
      $(this).nextUntil("h3",'.row').appendTo($("#groupindex-"+index))
    });
    $("#index .container .current").closest(".group").addClass("current");
    thiscurrent=$("#index .container .group.current")
    currentindex=$("#index .container .group").index(thiscurrent);
    // Calculate heiht/maxheight
    maxheight=0;
    $("#index .container .group").each(function(){
      if($(this).height()>maxheight){maxheight=$(this).height();}
    });

    //$("#index .container .group").height(maxheight);
    $("#index .container .group.current").addClass("active");
    $("#index .container .group:not(.current)").addClass("inactive");
    $("<b class='more seemore' />").prependTo(("#index .container h3"));
    $("#index .container h3").each(function(index){
        number=parseInt(index)+1;
        $("<i class='more seemore'>"+number+"</i>").prependTo($(this));
    });
    $("#index .container .active").prev("h3").find(".more").toggleClass('seemore seeless');
    $("#index .container .group:not(.active)").hide(0);
    //System to set haven't submit button moving
    containerheight=maxheight*1;
    $("#index .container h3").each(function(){
        containerheight+= $(this).outerHeight()*1;
    });
    $("#index .container > .row").each(function(){
        containerheight+= $(this).outerHeight()*1;
    });
    containerheight+= $("#index .container h2").outerHeight()*1;
    containerheight+=$("#index p.navigator").outerHeight()*1;
    containerheight+=40;// A 40px more 
//    $("#index .container").height(containerheight);
    $("#index .container").css('min-height', containerheight+'px');
    //$("#index .container").height($("#index .container").height()); // Don't work, hide is not so speed
    $("#index .container h3").click(function(){
      if(!$(this).next(".group").hasClass('active')){
        $("#index .container .group").slideUp(150);
        $(this).next(".group").slideDown(150);
        $("#index .container .group").removeClass('active');
        $(this).next(".group").addClass('active');
        $("#index .container h3 .more").removeClass('seeless').addClass('seemore');
        $(this).find('.more').removeClass('seemore').addClass('seeless');
        $("#index .toggleall").removeClass('seeless').addClass('seemore');
      }else{
        $(this).next(".group").slideUp(150);
        $("#index .container h3 .more").removeClass('seeless').addClass('seemore');
        $(this).next(".group").removeClass('active');
        $("#index .toggleall").removeClass('seeless').addClass('seemore');
      }
    });
    $("#index .container h3").css("cursor","pointer");
    $("#index h2").html($("#index h2").text()+"<div class='toggleall seemore' />");
    $("#index .toggleall").click(function(){
      if($(this).hasClass("seemore")){
        $("#index .group").slideDown(150);
        $("#index .group").addClass('active');
        $('#index h3 .more').removeClass('seemore').addClass('seeless');
        $(this).removeClass('seemore').addClass('seeless');
      }else{
        $("#index .group").slideUp(150);
        $("#index .group").removeClass('active');
        $('#index h3 .more').removeClass('seeless').addClass('seemore');
        $(this).removeClass('seeless').addClass('seemore');
      }
    });
  }

  $('#index .container .row .hdr').each(function(index){
     $(this).html("<i class='icon-none'></i>");
  });
  $('#index .container .row.answer .hdr').each(function(index){
     $(this).html("<i class='icon-ok'></i>");
  });
  $('#index .container .row.missing .hdr').each(function(index){
     $(this).html("<i class='icon-ok'></i>");
  });
  $('#index .container .row.current .hdr').each(function(index){
     $(this).html("<i class='icon-pencil'></i>");
  });
  $('#index .container .row.inactive').first().prev(".row").addClass("last");
}

// Some live action, not in document ready

$('#index input.submit').live("click", function(){
    $("#movesubmit").val("movesubmit");
    $("#limesurvey").submit();
    return true;
});


$(document).ready(function(){
    nosmartphone();
    navButtons();
    decimal = (typeof LEMradix === 'undefined') ? '.' : LEMradix;
    moveToTable(); // Maybe not here but after
    addPrint();
    // Replace text node by next node with <p></p>
    $(".survey-groupdescription" ).contents().filter( isTextNode ).each(function(){
        if($.trim($(this).text()).length>0){
            newHTML="<p class='automatic'>"+$(this).text()+"</p>";
            $(this).replaceWith(newHTML);
        }
    });
	// If it's the token or finish page, hide the navigation controls etc.
	if($(".skippage").length>0){
		$("#limesurvey [name=move]").val("movenext");
		$("#limesurvey").submit();
	}
	// Skip the welcome page if welcome text is empty
	if($(".survey-welcome").length>0){
	     if( $(".survey-welcome").text()==""){
		    $("#movenextbtnbis").click();
	    }else{
        $(".jsshow").hide();
        $(".jshide").slideDown('fast');
	    }
	}
	if ( $('#tokenform').length > 0)
	{
		$('.titleblock').html('<br><br>');
	}
	if ( $('.survey-completed').length > 0)
	{
		$('.titleblock').html('<br><br>');
	}
	/* Move the index outside survey-main */
	/* All made with css */
	$("#index").insertAfter("#survey-wrapper")
	// Hide the actual index submit buttons : don't remove it
	$('#index input.submit').hide();
	//Move the saveall button
	if ($("#saveall").length>0){
		$("#navbar .nav-right .nav").prepend("<li class='navbar-li'></li>");
		$("#saveall").prependTo("#navbar .navbar-li");
		// Adapt the script because save all
		if($('#index input.submit').length>0){
		    $("#resumebtn").html($('#index input.submit').val());
		    $("#resumebtn").addClass("movesubmit");
        }
        
	    $("#saveall #savebtn").click(function(){
            $("#limesurvey").append("<button type='submit' name='saveall' value='save' id='savebis' />");
            $("#movenext").val("save");
            $("#movesubmit").val("save");
            $("#savebis").click();
	    });
	    $("#saveall #resumebtn").click(function(){
	        movesubmit=0;
	        title=$("#saveall #resumebtn").text();
	        if($(this).hasClass("movesubmit")){movesubmit=1;}

	        if($(this).hasClass("movesubmit")){
                confirmbox="<div id='dialog-confirm' title='"+title+"'>";
                confirmbox=confirmbox+"<p>";
                confirmbox=confirmbox+"Are you done and ready to finish the survey?";
	            confirmbox=confirmbox+"</p></div>";
	        }else{
                confirmbox="<div id='dialog-confirm' title='"+title+"'>";
                confirmbox=confirmbox+"<p>";
                confirmbox=confirmbox+"Do you want to save your responses and take a break now?";
	            confirmbox=confirmbox+"</p></div>";
	        }
	        $("body").append(confirmbox);
	        $( "#dialog-confirm" ).dialog({
                resizable: true,
                height:200,
                modal: true,
                close: function() {$(this).remove();},
                buttons: {
                    "Yes": function() {
                        if(movesubmit){
	                        $("#limesurvey").append("<input type='hidden' name='resume' value='resume' />");
	                        $("#limesurvey [name='move']").val("movesubmit");
	                        $("#limesurvey").submit();
                        }else{
	                        $("#limesurvey").append("<button type='submit' name='saveall' value='resume' id='savebis' />");
	                        $("#movenext").val("save");
	                        $("#movesubmit").val("save");
                            $( this ).dialog( "close" );
	                        $("#savebis").click();
                        }
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                }
            });
	    });
//	    $("#saveall #resumebtn").click(function(){
//	        $("#limesurvey").append("<input type='hidden' name='resume' value='resume' />");
//	        $("#move").val("movesubmit");
//	        $("#limesurvey").submit();
//	   });
	}
	accordionIndex();


	// If last page, change "therearexquestions" message changes
	if ( $('#official-navigator button[id="movesubmitbtn"]').length > 0)
	{
		$("#therearexquestions").text("Congratulations, this is the last question.");
	}

    numericMasking();
	addClassEmpty();
    $(".survey-question-help").each(function(){
        if($(this).find("img").length>0){
            if($.trim($(this).find(':visible').text()).length<1)
            {
                $(this).find("img[alt='Help']").remove();
            }
        }
    })


  /* Notify */
  htmlnotify ='<div id="basic-template"><a class="ui-notify-cross ui-notify-close" href="#">x</a><h1>#{title}</h1>#{text}</div>';
  htmlnotify =htmlnotify+'<div id="error-template" class="error mandatory-block"><a class="ui-notify-cross ui-notify-close" href="#">x</a><h1>#{title}</h1>#{text}</div>';
  $("#container").html(htmlnotify);
  $container = $("#container").notify();
//	$("#container").css({
//		'right': ($(window).width() - $("#container").width())/2 + 'px'
//	});
  var timing=0;
  var alerttext = "";
  $("#alert-block div").each(function(){
    if($(this).html().length){
        alerttext=alerttext+"<p>"+$(this).html()+"</p>";
    }
  });

    haserror=false;
    issaved=false;
    if(alerttext=="<p>Your responses were successfully saved.</p>"){
        issaved=true;
    }
  if(alerttext.length>0)
  {
    errorlength=0;
    errorlist="<ul>";
    $(".input-error.question-wrapper").each(function(){
      var thisid=$(this).attr('id');
      var thistext=$(this).find('.survey-question-text').text();
      var emhelp=$.trim($(this).find(".survey-q-help:visible .questionhelp").text());
      if(emhelp==""){
        var emhelp=$.trim($(this).find(".survey-q-help:visible .errormandatory").text());
      }
      if(emhelp!=""){
          errorlist=errorlist+"<li><a href='#"+thisid+"' title='"+emhelp.replace(/'/g, "")+"'>"+thistext.replace("*", "")+"</a></li>";
          errorlength=errorlength+1;
      }
      haserror=true;
    });
    errorlist=errorlist+"</ul>";
    if(errorlength && haserror)
    {
        alerttext="<p>Please correct your answers these questions before continuing.</p>";
        alerttext=alerttext+errorlist;
    }
    else if(haserror)
    {
        alerttext="<p>Please correct your answers before continuing.</p>";
    }
  }
  if(alerttext.length>0){
    extraclass=""
    if(haserror){
        $("#container").notify("create","error-template", {
            title: '',
            text: alerttext
        },{
            stack: 'below',
            speed: 1000,
            expires: -1
        });
    }
    if(issaved){
	        title=$("#saveall #savebtn").text();
            confirmbox="<div id='dialog-confirm' title='Save'>";
            confirmbox=confirmbox+alerttext;
            confirmbox=confirmbox+"</div>";
	        $("body").append(confirmbox);
	        $( "#dialog-confirm" ).dialog({
                resizable: true,
                height:200,
                modal: true,
                close: function() {$(this).remove();},
                buttons: {
                    OK: function() {
                        $( this ).dialog( "close" );
                    }
                }
            });
    }
    if(!haserror && !issaved)
    {
        $("#container").notify("create", {
            title: '',
            text: alerttext
        },{
            stack: 'below',
            speed: 1000,
            expires: -1
        });
    }
  }
    $("#alert-block").addClass("done");

  /* With showpopup=0 */
  if($("#limesurvey > p > .errormandatory").length>0)
  {
    if(errorlength){
      $("#limesurvey > p > .errormandatory:last").append(errorlist);
      $("#limesurvey > p > .errormandatory a").qtip({
        style: {
          classes: 'qtip-light qtip-rounded',
          tip: {
            corner: true
          }
        },
        position: {
          my: 'bottom left',
          at: 'top right'
        }
      });
    }
  }
  // Can be done after showing HTML
  // Tooltip on survey-groupdescription table
  doToolTip();
  // Focusfirst AFTER meiomask
  focusFirst();
  // If survey hare All in one
  if($("body").hasClass("allinone")){
    //adaptAllInOne(); // Deactivate
  }
	maxlengthtextareabis();
    $("#carousel").jcarousel({
        visible:1,
        wrap: 'circular',
        auto: 5
    });
});

function isTextNode(){
    // If this is a text node, return true.
    return( this.nodeType === 3 );
}

function numericMasking(){
	// this script puts comma-separators in long numbers or other meiomask
	// Only if there are mask flags found on this page
	
	// First the delegate function for numeric

	$("#survey-wrapper").delegate("input.formatnumeric,textarea.formatnumeric","keyup", function(){ 
		value=formatNumber(unformatNumber($(this).val()),$(this).hasClass('integeronly'));;

		$("#"+$(this).attr('rel')).val(unformatNumber(value));
		$("#"+$(this).attr('rel')).keyup();
		$("#"+$(this).attr('rel')).change();
		if($("#"+$(this).attr('rel')).hasClass("error")){
			$(this).addClass("error");}else{$(this).removeClass("error");}
		value=formatNumber($("#"+$(this).attr('rel')).val(),$(this).hasClass('integeronly'));
		$(this).val(value);
	});
	// Remove the last dot
	$("#survey-wrapper").delegate("input.formatnumeric,textarea.formatnumeric","focusout", function(){ 
		value=$("#"+$(this).attr('rel')).val();
		//var re = new RegExp('[.]$', 'g');
		value=value.replace(/\.$/g, "");
		$("#"+$(this).attr('rel')).val(value);
		
	});
	if($('.maskFlag').length > 0) {
		// Define custom masks
		$.mask.masks = $.extend(
			$.mask.masks,{ // For numeric question type don't use 2 time the Decimal mark in the mask, else whole is removed AND - (minus) can not be used inside mask
				'phone-us': { mask : '(999) 9999 9999' },
				'time'          : { mask : '29:69' }
			}
		);
		// We can't use delegate because of the system control by question maskFlag
		// Find all mask flags, apply the appropriate mask to the inputs in that question
		$('.maskFlag').each(function(i){
			var maskName = $(this).text();
			if($.trim(maskName)==""){
				maskName="integeronly";
			}
			if($(this).closest('li[id^="javatbd"]').length>0){ // Can use different mask for each 
				var el = $(this).closest('li[id^="javatbd"]');}else{
				var el = $(this).closest('div[id^="question"]');}
			var thisnumeric=(
							$(this).closest('div[id^="question"]').hasClass('numeric') || 
							$(this).closest('div[id^="question"]').hasClass('numeric-multi') ||
							$(this).closest('div[id^="question"]').hasClass('array-multi-flexi') ||
							$(this).closest('div[id^="question"]').find('.numberonly').length>0 ||
							$(this).closest('div[id^="question"]').find('.numbers-only').length >0
							)
			if(maskName=="integeronly" || maskName=="numeric")
			{
				$('input[type=text]', el).each(function(){
					thisid=$(this).attr('id');
					if($(this).is("[maxlength]"))
						{maxlen=" maxlength='"+$(this).attr('maxlength')+"' ";}
						else{maxlen="";}
					if($(this).hasClass('em_sq_validation')){
						emsqvalidation=' em_sq_validation ';}
						else{emsqvalidation='';}
					if($(this).hasClass('integeronly') || maskName=="integeronly"){
						integeronly=' integeronly ';}
						else{integeronly='';}
					newinput="<textarea rows='1' cols='"+$(this).attr('size')+"' class='text formatnumeric "+integeronly+emsqvalidation+"' rel='"+thisid+"' id='new"+thisid+"' "+maxlen+">"+$(this).attr('value')+"</textarea>";
					$(newinput).insertAfter($(this));
					$("label[for='"+thisid+"']").attr('for','new'+thisid);
					$(this).css('opacity','0.4');
					$(this).hide();// comment for debug
					$("#new"+thisid).val(formatNumber($("#new"+thisid).val(),integeronly==' integeronly '));
				});
			}
			else if(thisnumeric)
			{
				$('input[type=text]', el).each(function(){
					thisid=$(this).attr('id');
					if($(this).is("[maxlength]"))
						{maxlen=" maxlength='"+$(this).attr('maxlength')+"' ";}
						else{maxlen="";}
					if($(this).hasClass('em_sq_validation')){
						emsqvalidation=' em_sq_validation ';}
						else{emsqvalidation='';}
					newinput="<textarea rows='1' cols='"+$(this).attr('size')+"' class='text maskednumeric maskedInput "+maskName+emsqvalidation+"' rel='"+thisid+"' id='new"+thisid+"' "+maxlen+">"+$(this).attr('value')+"</textarea>";
					//newinput="<input type='text' class='text maskednumeric maskedInput "+maskName+emsqvalidation+"' rel='"+thisid+"' id='new"+thisid+"' alt='"+maskName+"'"+maxlen+" size='"+$(this).attr('size')+"' value='"+$(this).attr('value')+"' />";
					$(newinput).insertAfter($(this));
					$("label[for='"+thisid+"']").attr('for','new'+thisid);
					$(this).css('opacity','0.4');
					$(this).hide();// comment for debug
				});
			}else{
				$('input[type=text]', el).attr('alt', maskName).addClass('maskedInput '+maskName);
				$('textarea', el).attr('alt', maskName).addClass('maskedInput '+maskName);
			}
		});
		// Apply masks to the inputs and textarea
		$('input.maskedInput').setMask();
		$('textarea.maskedInput').setMask();
		

		$('input.maskednumeric,textarea.maskednumeric').keyup(function(e){
			// if input is empty AND key!='-', then set to default mask (remove the signal system
			var code = (e.keyCode ? e.keyCode : e.which);
			if($(this).val()=="-" && code!=54){ 
				thismask=$(this).attr('alt');
				$(this).setMask(thismask).val('');
			}
			// Update LS input at keyup in masked input, and launch keyup default input (only if the original input is numeric)
			// WE CAN UPDATE it only on blur: error shown only when leave input
			$("#"+$(this).attr('rel')).val($(this).val());
			$("#"+$(this).attr('rel')).keyup();
			$("#"+$(this).attr('rel')).change();
			if($("#"+$(this).attr('rel')).hasClass("error")){
				$(this).addClass("error");}else{$(this).removeClass("error");}
		});
		// No need to interrupt next/submit function because we use other input box, and input text can get meiomask 
	}
}
function formatNumber(value,intonly,thousands_sep) {
// formate un chiffre avec 'decimal' chiffres après la virgule et un separateur
    // Strip all characters but numerical ones.
  if (typeof intonly === 'undefined'){intonly=false;}
    decimal = (typeof LEMradix === 'undefined') ? '.' : LEMradix;
    if(decimal!="."){
        value = value.replace(new RegExp(decimal, 'g'), '.');
    }
    value = (value + '').replace(/[^0-9+\-Ee.]/g, '');

    var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
    value=String(value);
     s = value.split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if(value.indexOf(".")>-1 && !intonly){
        s[1]=(typeof s[1] === 'undefined') ? '' : s[1];
        if ((s[1]).length > 3) {
            s[1] = s[1] || '';
            s[1] = s[1].split("").reverse().join("");
            s[1] = s[1].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            s[1] = s[1].split("").reverse().join("");
        }
        return s[0]+decimal+s[1];
    }
    else
    {
        return s[0];
    }

}
function unformatNumber(value,thousands_sep) {
    var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
    decimal = (typeof LEMradix === 'undefined') ? '.' : LEMradix;
    if(sep=='.'){
        value = value.replace(".", '');
    }else{
        value = value.replace(new RegExp(sep, 'g'), '');
    }
    return value;
}
function moveToTable(){
  $(".survey-groupdescription").each(function(){
    groupid=$(this).closest("[id^='group-']").attr("id");
    if($("#"+groupid+" .survey-groupdescription table, #"+groupid+" .survey-question-text table").length>0)
    {
      // Add the id
      alphabet=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
      $("#"+groupid+" .survey-groupdescription table, #"+groupid+" .survey-question-text table").each(function(index){
        tablenum=index;
        $(this).find("thead tr").each(function(index){
          linenum=index; // Starting to 0 for thead
          $(this).find("td,th").each(function(index){
            cellnum=index;
            cellcar=alphabet[cellnum];
            $(this).attr("id","cell"+groupid+"-"+tablenum+"-"+cellcar+linenum);
            //$(this).text("cell"+tablenum+"-"+cellcar+linenum);
          });
        });
        $(this).find("tbody tr").each(function(index){
          linenum=index+1;
          $(this).find("td,th").each(function(index){
            cellnum=index;
            cellcar=alphabet[cellnum];
            $(this).attr("id","cell"+groupid+"-"+tablenum+"-"+cellcar+linenum);
            //$(this).text("cell"+tablenum+"-"+cellcar+linenum);
          });
        });
      });
      // Move question in cell
      tablenum=0;
      $("#"+groupid+" .question-wrapper").not(".q-done").each(function(){
        thiscode=$(this).attr("rel");
        if (thiscode.endsWith("_")){
          thiscode=thiscode.split("_");
          thiscell=thiscode[thiscode.length-2];
          thiscell=thiscell.toUpperCase();
          if(thiscell=="BREAK"){
            tablenum++;
            if($(this).hasClass("boilerplate") && $.trim($(this).text()).length==0){$(this).remove();}
          }else{
            //$(this).find(".jslog").text(thiscell);
            if($(this).find(".survey-question-text .em_equation").length>0)
            {
                wrapperhtml="<div class='equation-wrapper'><div class='em_equation'>"+$(this).find(".survey-question-text .em_equation").html()+"</div></div>"
                $(this).find(".survey-question-text").html(wrapperhtml);
                $("#cell"+tablenum+"-"+thiscell+" .suffix").appendTo($(this).find(".survey-question-text .equation-wrapper"));
                $("#cell"+tablenum+"-"+thiscell+" .prefix").prependTo($(this).find(".survey-question-text .equation-wrapper"));
            }
            $(this).appendTo($("#cell"+groupid+"-"+tablenum+"-"+thiscell));
            $(this).addClass("q-done");
            if($(this).hasClass("input-error")){$("#cell"+groupid+"-"+tablenum+"-"+thiscell).addClass('cell-error');}
              //$(this).html("#cell"+groupid+"-"+tablenum+"-"+thiscell);
          }
        }
      });
    }
  });
  

  // Add the asterisk
  $(".survey-groupdescription table, .survey-question-text table").find("tbody tr").each(function(index){
      element=$(this).children(":first");
    if($(this).find('.mandatory').length>0)
    {
      if($(this).children(":first").find(".asterisk").length>0){
          $(this).children(":first").find(".asterisk").text("*");
      }
      else
      {
          $(this).children(":first").html("<span class='asterisk '>*</span> "+$(this).children(":first").html());
      }
      $(this).children(":first").addClass("mandatory");
    }
  });
  adaptTable();
}
function adaptTable(){
  var doremove=true;
  //if($("body").hasClass("allinone")){ doremove=false;}// We can not do it with survey in one page: because we don't know if we need all colummn and line.
    $(".survey-groupdescription table,.survey-question-text table").each(function(index){
      // Width of col
      if($(this).find("col").length==0)
      {
        $(this).find(".jsstarthide").removeClass("jsstarthide");
        $(this).find("thead td,thead th").children().each(function(){
          if($(this).css("display") == "none" && doremove){
            $(this).remove();
          }
        });

        nbcell=$(this).find("thead td,thead th").length;
        nbnotemptycell=$(this).find("thead td,thead th").not(":first").not(":empty").length;
        colwidth=100/(nbnotemptycell+2);
        colhtml="<colgroup>";
        // Fix if only one column
        if(nbnotemptycell==1){
          $(this).wrap('<div class="maxwidth-table" />');
          $(this).parent(".maxwidth-table").addClass('table600');
        }
        else if(nbnotemptycell==2){
          $(this).wrap('<div class="maxwidth-table" />');
          $(this).parent(".maxwidth-table").addClass('table700');
        }
        else if(nbnotemptycell==3){
          $(this).wrap('<div class="maxwidth-table" />');
          $(this).parent(".maxwidth-table").addClass('table700');
        }
        else if(nbnotemptycell>4){
          $(this).wrap('<div class="more4" />');
        }
          colhtml=colhtml+"<col style='width:"+2*colwidth+"%'>";
        for (var i = 1; i < nbcell; i++) {
            if($(this).find("thead td,thead th").eq(i).is(":empty"))
            {
              colhtml=colhtml+"<col style='width:0%'>";
              $(this).find("tbody tr").each(function(){
                $(this).find("td,th").eq(i).css('overflow','hidden');
                $(this).find("td,th").eq(i).children().hide();
              });
            }
            else
            {
              colhtml=colhtml+"<col style='width:"+colwidth+"%'>";
            }
        }
        colhtml=colhtml+"</colgroup>";
        $(this).prepend(colhtml);
      }
        $(this).find("tbody tr").each(function(){
          $(this).find("th").children().each(function(){
            if($(this).css("display") == "none" && doremove){
              $(this).remove();
            }
          });
          thisremove=true;
          $(this).children().each(function(){
            $(this).find("hr").remove();
            if($.trim($(this).html()).length>0){thisremove=false;}
            if($.trim($(this).html()).length==0){$(this).addClass("emptycell");}
            if($.trim($(this).html())=="&nbsp;"){$(this).addClass("dividers");$(this).parent("tr").addClass("havedividers");}
            if($.trim($(this).html())=="&nbsp;"){$(this).html("");}
            if($.trim($(this).html())!="&nbsp;" && $.trim($(this).html()).length>0){$(this).parent("tr").addClass("not-dividers");}
          });
          if(thisremove){
            $(this).remove();
          }
        });
    });
    showHTML();
}
function showHTML(){
  // All HTML is done
  // Show content
  $(".jsshow").hide();
  $(".jsstarthide").removeClass("jsstarthide");
//  $(".survey-groupdescription table").animate({opacity:'1'}, 500, function() {
//    $("#survey-wrapper").animate({opacity:'1'}, 1000)
//  });
    $("#jswaiting").fadeOut(300,function(){
        $("#jswaiting").remove();
    });
//    $("#survey-wrapper,#index").animate({opacity:'1'}, 500);
    $("#survey-wrapper,#index").css('opacity', 1).fadeIn();
    $(".titleblock").css('opacity', 1).fadeIn();
}
function doToolTip(){
  $(".survey-groupdescription table .survey-question-help img[alt='Help'],table.summary .survey-question-help img[alt='Help']").remove();
  $(".survey-groupdescription table .survey-question-help:empty,table.summary .survey-question-help:empty").remove();
  $(".survey-groupdescription table .equation .survey-question-help,table.summary .equation .survey-question-help").remove();// Never use equation help question type
  $(".survey-groupdescription table tr,table.summary tr").each(function(){
    if($(this).find('th .survey-question-help').html()){
      newHTML="<i class='icon-question-sign'></i> "+$(this).find(".survey-question-text").html();
      //$(this).find('th .survey-question-help').html("<i class='icon-question-sign'></i>"+$(this).find('th .survey-question-help').html());
      $(this).find("th .survey-question-text").html(newHTML);
      var qtipcontent=$(this).find('th .survey-question-help').html();
      var qtiptarget= $(this).find('th .icon-question-sign');
      $(this).qtip({
        content: {
          text: qtipcontent
        },
        style: {
          classes: 'qtip-light qtip-rounded',
          tip: {
            corner: true
          }
        },
        position: {
          my: 'bottom left',
          at: 'top right',
          target: qtiptarget
        }
      });
    }
  });
  
  $(".survey-groupdescription table tbody td,table.summary tbody td").each(function(){
    var qtipbaseid=$(this).attr('id');
    if($(this).find('.survey-q-help .errormandatory')){
      var qtipcontent=$(this).find('.survey-q-help .errormandatory').html();
          $(this).find('input.text').qtip({
            id: qtipbaseid+'-error',
            overwrite: false,
            content: {
              text: qtipcontent
            },
            style: {
              classes: 'qtip-red qtip-rounded',
              tip: {
                corner: true
              }
            },
            position: {
              my: 'bottom left',
              at: 'top right'
            },
            show: {
              event: 'focus'
            },
            hide: {
              event: 'focusout unfocus'
            }
          });
    }

    if($(this).find('.survey-q-help .questionhelp')){
      var qtipcontent=$(this).find('.survey-q-help .questionhelp').html();
      if(qtipcontent && qtipcontent.length>0){
        $(this).qtip({
          id: qtipbaseid+'-em',
          overwrite: false,
          content: {
            text: qtipcontent
          },
          style: {
            classes: 'qtip-cream qtip-rounded',
            tip: {
              corner: true
            }
          },
          position: {
                my: 'center left',
                at: 'center right'
          }
        });
      }
    }
    $(".print").qtip({
        style: {
          classes: 'qtip-light qtip-rounded',
          tip: {
            corner: true
          }
        }
    });
  });
}
function addPrint(){
    if($(".survey-groupname").length>0)
    {
        htmlPrint="<i class='print' title='Print this page'> </i>";
        $(".survey-main").prepend(htmlPrint);
        $(".print").click(function() {window.print();});
    }
}
function adaptAllInOne(){
// This part can wrok, but think it's best to use only relevace equation
    // Put a specific class for "start hidden group"
    $("[id^=group-]").each(function(){
        if($(this).not(":visible")){
            $(this).addClass("starthidden");
        }
    });
    // Show Hidden group
    $("[id^=group-]").show();
    // Show hidden question, not in table and not eaquation (?)
    //$("[id^=group-] > .question-wrapper:not(.equation)").show();
    // And now for gridly table cell
    htmlShow="<i class='showallq'>Show cell question</i>";
    $(".survey-main").prepend(htmlShow);
    $(".showallq").click(function() {
        $(".survey-groupdescription table th .question-wrapper:first-child").show();
        $(".survey-groupdescription table td .question-wrapper:first-child").show();
        $(".showallq").remove();
    });
}
function maxlengthtextareabis(){

    // Calling this function at document.ready : use maxlength attribute on textarea
    // Can be replaced by inline javascript
    $("body").delegate("textarea[maxlength]","change keyup focusout",function(){
        var maxlen=$(this).attr("maxlength");
        if ($(this).val().length > maxlen) {
            $(this).val($(this).val().substring(0, maxlen));
        }
    });
    $("body").delegate("textarea[maxlength]","keydown",function(){
        var maxlen=$(this).attr("maxlength");
        var k =event.keyCode;
        if (($(this).text().length >= maxlen) &&
         !(k == null ||k==0||k==8||k==9||k==13||k==27||k==37||k==38||k==39||k==40||k==46)) {
            // Don't accept new key except NULL,Backspace,Tab,Enter,Esc,arrows,Delete
            return false;
        }
    });
}
