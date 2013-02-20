var host = 'http://puton.jit.su/';

var loadStyle = function (href) {
	var css = document.createElement('link');
	css.setAttribute('rel', 'stylesheet');
	css.setAttribute('type', 'text/css');
	css.setAttribute('href', host + href);
	document.body.appendChild(css);
};
loadStyle("css/style.css");
loadStyle("css/codemirror.css");

var loadScript = function(src) {
	var js = document.createElement('script');
	js.src = host + src;
	document.body.appendChild(js);
};
loadScript("js/libs/jquery.js");
loadScript("js/libs/underscore.js");
loadScript("js/libs/codemirror.js");
loadScript("js/libs/backbone.js");
loadScript("js/libs/pouch.js");
loadScript("js/libs/sandbox.js");
loadScript("js/templates/app.js");
loadScript("js/scripts/app.js");

var x = new App();
x.start();

var container = document.createElement('div');
container.setAttribute('id', 'puton-container');

var h1 = document.createElement('h1');
h1.innerHTML = "Puton";
container.appendChild(h1);

var putonmain = document.createElement('div');
putonmain.setAttribute('id', "puton-main");

var b = document.createElement('b');
var label = document.createElement('label');
label.setAttribute('for', "db");
label.innerHTML = "db name: ";
b.appendChild(label);

var input = document.createElement('input');
input.setAttribute('id', 'db');
input.setAttribute('type', 'text');

putonmain.appendChild(b);
putonmain.appendChild(input);

var log = document.createElement('div');
log.setAttribute('id', 'log');

container.appendChild(putonmain);
container.appendChild(log);

document.body.appendChild(container);