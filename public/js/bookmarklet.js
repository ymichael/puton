var loadScript = function() {
	var js = document.createElement('script');
	js.src = 'http://puton.jit.su/js/puton.js';
	document.body.appendChild(js);
};
loadScript();

var loadStyle = function (href) {
	var css = document.createElement('link');
	css.setAttribute('rel', 'stylesheet');
	css.setAttribute('type', 'text/css');
	css.setAttribute('href', href);
	document.body.appendChild(css);
};
loadStyle("http://puton.jit.su/css/style.css");
loadStyle("http://puton.jit.su/css/codemirror.css");


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
label.innerHTML = "db name:";
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