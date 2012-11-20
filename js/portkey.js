var urllocation = 'http://portkeyapp.herokuapp.com/';
//var urllocation = 'http://localhost:5000/';

function strip(s) {
    var div = document.createElement('html');
    div.innerHTML = s;

    var scripts = div.getElementsByTagName('script');
    var i = scripts.length;
    while (i--) {
      scripts[i].parentNode.removeChild(scripts[i]);
    }

    var stylesheets = div.getElementsByTagName('link');
    var i = stylesheets.length;
    while (i--) {
    	stylesheets[i].parentNode.removeChild(stylesheets[i]);
    }

    var stylesheets = div.getElementsByTagName('style');
    var i = stylesheets.length;
    while (i--) {
    	stylesheets[i].parentNode.removeChild(stylesheets[i]);
    }

    return div.innerHTML;
 }

var html = strip( document.documentElement.innerHTML);

function PrintRules() {
	var genString = '';

	var sheets = document.styleSheets;
	for( var j = 0; j< sheets.length; j++){
		var rules = sheets[j].rules || sheets[j].cssRules;
		if (rules == null){
			genString += '</style><link rel="stylesheet" type="text/css" href="' + sheets[j].href + '"/><style>'
		}else{
			for(var x=0;x<rules.length;x++) {
				genString += rules[x].cssText;
	    	}
		}
	}
    return genString;
}

var css = PrintRules();

document.documentElement.innerHTML = html;
document.head.innerHTML += "<style>" + css + "</style>";

var content = document.documentElement.innerHTML;

document.body.innerHTML += 
    '<form id="portkeyPOST" enctype="application/x-www-form-urlencoded"'
        + ' action=" ' + urllocation + 'api" method="post">'
        + '<input type="hidden" name="content" value="' + encodeURIComponent(content) + '">' 
        + '</form>';

document.getElementById('portkeyPOST').submit();



