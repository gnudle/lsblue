$(function() {
    $(".havethousand").each(function(){
        var thousandseperator=$(this).data('thousand');
        if(thousandseperator)
        {
            var intonly=$(this).hasClass('integeronly');
            $(this).val(formatNumber($(this).val(),intonly,thousandseperator));
        }
    });
});
$("#limesurvey").live('submit',function(){
    $(".havethousand").each(function(){
        var thousandseperator=$(this).data('thousand');
        $(this).val($(this).val().replace(new RegExp(thousandseperator, 'g'),""));
    });
});
/**
 * checkconditions : javascript function attach to some element 
 * Launch ExprMgr_process_relevance_and_tailoring with good value
 */
function checkconditions(value, name, type, evt_type)
{
    if (typeof evt_type === 'undefined')
    {
        evt_type = 'onchange';
    }
    if (type == 'radio' || type == 'select-one')
    {
        $('#java'+name).val(value);
    }
    else if (type == 'checkbox')
    {
        if ($('#answer'+name).is(':checked'))
        {
            $('#java'+name).val('Y');
        } else
        {
            $('#java'+name).val('');
        }
    }
    else if (type == 'text' && name.match(/other$/))
    {
        $('#java'+name).val(value);
    }
    if($.isFunction(window.ExprMgr_process_relevance_and_tailoring ))
        {ExprMgr_process_relevance_and_tailoring(evt_type,name,type);}
}
/**
 * fixnum_checkconditions : javascript function attach to some element 
 * Update the answer of the user to be numeric and launch checkconditions
 */
function fixnum_checkconditions(value, name, type, evt_type, intonly,thousandseperator)
{
    newval = new String(value);
    if(typeof thousandseperator=="undefined"){thousandseperator="";}
    if (typeof intonly !=='undefined' && intonly) {
        newval = newval.replace(intRegex,'');
    }
    else {
        newval = newval.replace(numRegex,'');
    }
    if (LEMradix === ',') {
        newval = newval.split(',').join('.');
    }
    if (newval != '-' && newval != '.' && newval != '-.' && newval != parseFloat(newval)) {
        newval = '';
    }
    displayVal = newval;
    if (LEMradix === ',') {
        displayVal = displayVal.split('.').join(',');
    }
    if(thousandseperator!="")
    {
        displayVal = formatNumber(displayVal,intonly,thousandseperator);
    }
    if (name.match(/other$/)) {
        $('#answer'+name+'text').val(displayVal);
    }
    $('#answer'+name).val(displayVal);

    if (typeof evt_type === 'undefined')
    {
        evt_type = 'onchange';
    }
    checkconditions(newval, name, type, evt_type);
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
