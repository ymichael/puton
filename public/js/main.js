/*global require:true */
require.config({
	paths: {
		'jquery': "libs/jquery",
		'underscore': "libs/underscore",
		'backbone': "libs/backbone",
		'pouch': "libs/pouch",
		'app': "scripts/app",
		'templates': "templates/template",
		'jquery.cookie': 'libs/jquery.cookie',
		'jquery.tree': 'libs/jquery.tree',
		'state': 'libs/state',
		'sandbox': 'libs/sandbox'
	},
	shim: {
		"underscore": {
			deps: [],
			exports: "_"
		},
		"backbone": {
			deps: ['underscore', 'jquery'],
			exports: "Backbone"
		},
		"pouch": {
			deps: [],
			exports: "Pouch"
		},
		"sandbox": {
			deps: ['backbone','pouch'],
			exports: "Sandbox"
		},
		"jquery.tree": {
			deps: ['jquery'],
			exports: "$.tree"
		},
		"app": {
			deps: ["jquery.tree"]
		}
	}
});
require(['app','sandbox'], function(App){
	var x = new App();
	x.start();
});