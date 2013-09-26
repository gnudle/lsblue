/*
 * LimeSurvey
 * Copyright (C) 2007 The LimeSurvey Project Team / Carsten Schmitz
 * Copyright (C) 2012-2103 Practice Lab
 * Copyright (C) 2012-2103 Denis Chenu
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
 */

String.prototype.endsWith = function (s) {
  return this.length >= s.length && this.substr(this.length - s.length) == s;
}
function navbuttonsJqueryUi(){}
/* Optionnal functions ----------------------------------------------------------- */

/*
 * The focusFirst function is added to the eventlistener, when the page is loaded.
 * This can be used to start other functions on pageload as well. Just put it inside the 'ready' function block
 */
 
function focusFirst(Event)
{
	firstinputid=$('#limesurvey .survey-question:visible:first input.text:visible,#limesurvey .survey-question:visible:first textarea:visible').eq(0).attr("id");
	if($("#"+firstinputid).closest(".other").length==0){
	    $("#"+firstinputid).focus();
	}
}

/*
 * Add and update empty class to input text and textarea
 */
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

/* Clarity specific function ----------------------------------------------------------- */

/*
 * Beautiful button and move navigation button where needed
 */
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

/*
 * Detect or alert and deactivate survey for screen lesser than 600px,
 * Activated by a element with id nosmartphone 
 * Survey deactivated by a element with id nosmartphone and remove class
 */
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

/*
 * Better view for #index in accordeon
 */
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
/* Needed function for index */
$('#index input.submit').live("click", function(){
    $("#movesubmit").val("movesubmit");
    $("#limesurvey").submit();
    return true;
});

/*
 * Show content after manipulation is done
 */
function showHTML(){
  $(".jsshow").hide();
  $(".jsstarthide").removeClass("jsstarthide");
    $("#jswaiting").fadeOut(300,function(){
        $("#jswaiting").remove();
    });
    $("#survey-wrapper,#index").css('opacity', 1).fadeIn();
    $(".titleblock").css('opacity', 1).fadeIn();
}

/* Document ready functions ----------------------------------------------------------- */
$(document).ready(function(){
    nosmartphone();
    navButtons();
    decimal = (typeof LEMradix === 'undefined') ? '.' : LEMradix;
    moveToTable(); // Maybe not here but after
    showHTML();
});

/* Table functions ..... */
function multiMoveToTable(){
    var groupids = $("[id^='group-']")
             .map(function() { return this.id; }) //Project Ids
             .get(); //ToArray
    var jsonurl=$("#jsonbaseurl").text()+"empty.html";
}
function loopAjax(jsonurl,groupids) {

    $.ajax({
        url: jsonurl,
        dataType : 'html',
        success: function (data) {
          moveToTable("group-6");
        }
    });

}
function moveToTable(groupid){
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
            if($(this).hasClass("boilerplate") && $.trim($(this).html()).length==0){$(this).remove();}
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

  // Add the asterisk
  $("#"+groupid+" .survey-groupdescription table,#"+groupid+"  .survey-question-text table").find("tbody tr").each(function(index){
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

}
/* Global functions ----------------------------------------------------------- */
function htmlEncode(value){
    if (value) {
        return jQuery('<div />').text(value).html();
    } else {
        return '';
    }
}
