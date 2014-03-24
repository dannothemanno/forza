var childElement, pageName = "", elementId, elementVal;
function GetPageName() {
	var path = decodeURIComponent(window.location.pathname);
    pageName = path.substring(path.lastIndexOf('/') + 1);
}
function SetCookies() {
    /* Dont save cookie if querystring contains COOKIE=FALSE */
    var querystring = document.location.search;
    if (querystring.length > 0) {
        if (querystring.toUpperCase().search('COOKIE=FALSE') > -1) {
            return;
        }
    } 
	//if (pageName == "") GetPageName();
	var counter = 0;
	var counterCookie = 0;
	var currentCookie;
	$('input:checkbox, input:radio, input:text, input:hidden, select, textarea').each(function () {
		var elem = $(this);
		elementId = elem.attr('id');	

		/* if cookie count more than 150 dont create any cookie */
		if(counterCookie >=150){ return false;}

		/* store value of type text, textareas and hidden values with no readonly attribute */
		if (elem.val().trim().length > 0 && (elem.is('input:text, textarea') && elementId.indexOf('aux')<1 && elem.attr('readonly') != "readonly" || elem.is('select'))) {    
			elementVal = elem.val().trim();
			/* cookie cannnot save value more than 3701 */
			if(elementVal.length > 3701) { return true;}
			/*$.cookie(pageName + "_" + elementId, elementVal);*/
			$.cookie(elementId, elementVal,{ expires : 30 });
			counter = counter + elementVal.length;	
		}
		else if(elem.is('input:checkbox, input:radio'))
		{
			elementVal = document.getElementById(elementId).checked;
			if(elementVal!=undefined)
			{
				/*$.cookie(pageName + "_" + elementId,true);	*/
				$.cookie(elementId, elementVal,{ expires : 30 });
				counter = counter + elementVal.length;	
			}
		}
		counterCookie++;		
	});	
}

function GetCookies() {
    /* Dont read cookie if querystring contains COOKIE=FALSE */
    var querystring = document.location.search;	
	if(querystring.length>0){
	    if (querystring.toUpperCase().search('COOKIE=FALSE') > -1)
		{
		    return;
		}
	}   
    //if (pageName == "") GetPageName();

    /* loop through each cookie and write value to element */
	if (document.cookie && document.cookie != '') {
		var id_val, elem, elemId, elemType;
		var split = document.cookie.split(';');
		for (var i = 0; i < split.length; i++) {
			id_val = split[i].split("=");
			var plain = decodeURIComponent(id_val[0]).trim();	
			elemId = plain;//.substring(pageName.length+1, plain.length);
			try{			
			elem = $('#'+elemId);	
			}catch(err){}
			if (elem.is('input:text, input:hidden, textarea') || elem.is('select')) {				
				elem.val($.cookie(plain));
				
				if(elem.css('display') =='none' && elem.attr('data-widgettype')!=undefined)
				{
					SetWidgetValue(elem);
				}
			}
			else 
			{					
				if($.browser.msie!=undefined)
				{
					if($.cookie(plain)=='true')document.getElementById(elemId).checked=true;	
				}
				else if(document.getElementById(elemId)!=undefined)
				{	
					if($.cookie(plain)=='true')document.getElementById(elemId).checked=true;					
				}
			}
		}
    }

    /*if there is FORCE=TRUE in querystring, querystring value should replace the cookie value with same key.
    If user passes the value like: ?FORCE=TRUE then he wont b able to set the value. 
    For now force shud not b the first string passed.*/
    var querystring = document.location.search;
    if (querystring.length > 0) {
        if (querystring.toUpperCase().search('FORCE=TRUE') > -1) {
            LoadFromQueryString();
        }
    }	
}

function SetWidgetValue(obj){
	var widgetType=obj.attr('data-widgettype');
	var elemId=obj.attr('id');
	if(widgetType=='datepicker')
	{	
		TriggerOnchange(elemId);		
	}
	else
	{		
		var strExe = "$('#"+widgetType+"_"+elemId+"')."+widgetType+"('value',"+obj.val()+");";
		if(widgetType=='slider')
		{
			strExe = strExe +"$('#"+widgetType+"_"+elemId+"').find('a').attr('title', 'slider value='+$('#"+widgetType+"_"+elemId+"')."+widgetType+"('option','value'));";
		}
		eval(strExe);
	}
}

function ClearCookie() {
	var id_val;
	if (document.cookie && document.cookie != '') {
		var split = document.cookie.split(';');
		for (var i = 0; i < split.length; i++) {
			id_val = split[i].split("=");
			id_val[0] = id_val[0].replace(/^ /, '');
			$.cookie(id_val[0],null);
		}				
	}
}

function FillValues()
{
	var elem, counter=1;
	$('input:text, textarea').each(function () {
	if(counter < 151)
	{
		elem = $(this);
		elem.val(counter);
		counter++;
		}
	});
}