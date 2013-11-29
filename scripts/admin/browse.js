/*
* LimeSurvey
* Copyright (C) 2007 The LimeSurvey Project Team / Carsten Schmitz
* All rights reserved.
* License: GNU/GPL License v2 or later, see LICENSE.php
* LimeSurvey is free software. This xversion may have been modified pursuant
* to the GNU General Public License, and as distributed it includes or
* is derivative of works licensed under the GNU General Public License or
* other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
*
* $Id: browse.js 10251 2011-06-10 17:33:49Z tpartner $
*/
$(document).ready(function(){
    $('ul.sf-menu').superfish({
        speed:'fast'
    }); 
    $("#selectall").click(function(){
        $('.cbResponseMarker').attr('checked',$(this).attr('checked'));
    });
    // Update the responses table if completionstate change
    $("#browseresults #completionstate").change(function(){
        $("#limit").val('');
        $("#browseresults").submit();
    });
    
    $('#browseresponses').qtip({
        content:{
            text:$('#browselangpopup')
        },
        style: { name: 'cream',
            tip:true,
            color:'#111111',
            border: {
                width: 1,
                radius: 5,
                color: '#EADF95'}
        },
        position: { adjust: {
            screen: true, scroll:true },
            corner: {
                target: 'bottomMiddle',
                tooltip: 'topMiddle'}
        },
        show: {effect: { length:50},
            when: {
                event:'click'
        }},
        hide: {fixed:true,
            when: {
                event:'unfocus'
        }}
    });

    // Fix the heigh of the cell
    $('.browsetable td').each(function(){
        if ($.trim($(this).text()).length > 30){
            $(this).html("<span class=\"content\" title=\""+htmlspecialchars(htmlspecialchars($(this).text(),'ENT_HTML_QUOTE_DOUBLE'),'ENT_QUOTES')+"\">"+$(this).html()+"</span>");
        }
    });
    $('.browsetable th strong').each(function(){
        if ($.trim($(this).text()).length > 30){
            $(this).addClass("content");
            $(this).attr("title",$(this).text());
        }
    });

    $('.browsetable td span.content').qtip({
        hide: {
            fixed: true,
            delay: 500
        },
        position: {
            corner: {
                target: 'leftMiddle',
                tooltip: 'topRight'
            }
        }
    });
    $('.browsetable th strong.content').qtip({
        hide: {
            fixed: true,
            delay: 500
        },
        position: {
            corner: {
                target: 'leftMiddle',
                tooltip: 'topRight'
            }
        }
    });
    // Delete individual file
    $(".deleteresponse").click(function(){
        thisid=removechars($(this).attr('id'));
        answer = confirm(strdeleteconfirm);
        if (answer==true)
        {
            $('#deleteanswer').val(thisid);
            $('.cbResponseMarker').attr('checked',false);
            $('#resulttableform').submit();
        }
    });
    // Delete all marked responses
    $("#imgDeleteMarkedResponses").click(function(){
        if ($('.cbResponseMarker:checked').size()>0)
        {
            thisid=removechars($(this).attr('id'));
            answer = confirm(strDeleteAllConfirm);
            if (answer==true)
            {
                $('#deleteanswer').val('marked');
                $('#resulttableform').submit();
            }
        }
        else
            alert(noFilesSelectedForDeletion)
    });

    // Download individual file bundle
    $(".downloadfile").click(function() {
        thisid = removechars($(this).attr('id'));
        $('#downloadfile').val(thisid);
        $('.cbResponseMarker').attr('checked', false);
        $('#resulttableform').submit();
    });

    // Download all marked files
    $("#imgDownloadMarkedFiles").click(function() {
        if ($('.cbResponseMarker:checked').size() > 0)
        {
            $('#downloadfile').val('marked');
            $('#resulttableform').submit();
        }
        else
            alert(noFilesSelectedForDnld)
    });

    addUpdateResponse();
});

/*
* Used to update response one by one
* To move in asset when plugged
*/

function addUpdateResponse()
{
    var docUrl=document.URL;
    var jsonUrl="/q/recompute";// Need to use LS.url from plugin
    var aUrl=docUrl.split('/');
    var surveyid=aUrl[aUrl.indexOf("surveyid")+1];
    var controllers=aUrl[aUrl.indexOf("admin")+1];
    if($('table.detailbrowsetable').length>0)// Browse one response
    {
        // Find the response id
        var responseId=aUrl[aUrl.indexOf("id")+1];
        // OR var responseId= aUrl.pop();
        $('.menubar').eq(1).find('.menubar-main').append("<div class='updateanswer' data-responseid='"+responseId+"'>Update This Answer</div>");
        $('.updateanswer').click(function(){
            // Need function for url LS.createUrl = function (route, params)
            //jsonUrl="http://practicelab.sondages.pro/q/recompute?sid="+surveyid+"&srid="+responseId;
            $("#updatedsrid").remove();
                $.ajax({
                url: jsonUrl,
                dataType : 'json',
                data : {sid: surveyid, srid: responseId},
                success: function(data){
                    if(data.updatedValueCount>0){console.debug(data.updatedValues);}
                    var $dialog = $('<div id="updatedsrid"></div>')
                        .html("<p>"+data.message+"</p>")
                        .dialog({
                            title: data.status,
                            dialogClass: 'updatedsrid',
                            buttons: { 
                                "Ok": function() { $(this).dialog("close"); },
                                "Reload": function() { window.location.reload(); } 
                                },
                            modal: true,
                            close: function () {
                                $(this).remove();
                            }
                        });
                }
            });
        });
    }
    if(controllers=='responses'){
        $('.menubar').eq(0).find('.menubar-main').append("<div class='updateanswers'>Update all submitted answers</div>");
            $(".updateanswers").live("click",function(){
                var jsonurl=$(this).attr('rel');
                  $("#updatedsrid").remove();
                  var $dialog = $('<div id="updatedsrid" style="overflow-y:scroll"></div>')
                    .html("")
                    .dialog({
                      height: 200,
                      title: "Status",
                      dialogClass: 'updatedsrid',
                      buttons: { Cancel: function() { $(this).dialog("close"); } },
                      modal: true,
                      close: function () {
                          $(this).remove();
                      }
                  });
                loopUpdateResponse(jsonUrl,surveyid,0);
            });
    }
}

function loopUpdateResponse(jsonurl,surveyid,responseid) {
  if($("#updatedsrid").length>0)
  {
    $.ajax({
        url: jsonurl,
        dataType : 'json',
        data : {sid: surveyid, srid: responseid,next : 1},
        success: function (data) {
          $("#updatedsrid").prepend("<p style='margin:0;display:none'>"+data.message+"</p>");
          $("#updatedsrid p:first-child").slideDown(500);
          //$("#updatedsrid p:nth-child(6)").fadeOut(500,function() {$(this).remove();});
            if (data.next) {
                loopUpdateResponse(jsonurl,surveyid,data.next);
            } else {
              $("#updatedsrid").closest(".ui-dialog").find(" .ui-dialog-buttonset .ui-button-text").html("Done");
              $("#updatedsrid").prepend("<p style='margin:0;font-weight:700'>Done</p>");
            }
        }
    });
  }
}

/*    $("#responseTable")
.jqGrid({
url: siteURL + "/admin/responses/" + surveyID + "/grid",
editurl: siteURL + "/admin/responses/" + surveyID + "/grid",
datatype: "json",
mtype: "POST",
caption: "Responses",
width: "100%",
height: "100%",
rowNum: 25,
pager: "#responsePager",
editable: true,
colNames: colNames,
colModel: colModel,
sortname: 'id',
sortorder: 'asc',
viewrecords : true,
gridview: true,
multiselect: true,
loadonce: true,
rowList: [25,50,100,250,500,1000,2500,5000],
ondblClickRow: function(id) {
if (lastSel != id) {
$('#responseTable').saveRow(lastSel);
$('#responseTable').editRow(id, true);
lastSel=id;
}
},
onSelectRow: function(id) {
$('#responseTable').saveRow(lastSel);
}
})
.filterToolbar({
'autosearch': true,
'searchOnEnter': false
})
.navGrid("#responsePager", {
'add': false,
'refresh': false,
'edit': false
})
.navButtonAdd("#responsePager", {
'caption': 'Download marked files',
'onClickButton': function (rows) {
var rows = $("#responseTable").getGridParam('selarrrow');

if (rows.length <= 0) {
alert ("Please select some records first!");
return;
}

sendPost(siteURL + "/admin/responses/" + surveyID + "/grid", {
'oper': 'downloadarchives',
'ids': rows
});
}
})  */


/**
Send a post request to the server to download a file

@param myaction     post action
@param data         parameters for $_POST

*/
function sendPost(myaction, checkcode, arrayparam, arrayval)
{
    var myform = document.createElement('form');
    document.body.appendChild(myform);
    myform.action =myaction;
    myform.method = 'POST';
    for (i=0;i<arrayparam.length;i++)
    {
        addHiddenElement(myform,arrayparam[i],arrayval[i])
    }
    addHiddenElement(myform,'checksessionbypost',checkcode)
    myform.submit();
}




/**
Dowload a file from a response
@param id       ID of the response
@param column   Field of the text upload question
@param filename Name of the file
*/
function getFile(id, field, filename)
{
    sendPost(siteURL + "/admin/responses/" + surveyID + "/grid", 
        new Array(
            'id',
            'fieldname',
            'oper',
            'filename'
        ),
        new Array(
            id,
            field,
            'downloadfile',
            filename
    ));
}


/**
Get an archive containing all the file from a response
@param id       ID of the response
*/
function getArchive(id)
{
    sendPost(siteURL + "/admin/responses/" + surveyID + "/grid", 
        new Array(
            'oper',
            'id'),
        new Array(
            'downloadarchive',
            id)        
    );
}

