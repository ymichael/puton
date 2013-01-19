/*global require:true */
require.config({
	paths: {
		'jquery': "libs/jquery",
		'underscore': "libs/underscore",
		'backbone': "libs/backbone",
		'pouch': "libs/pouch",
		'app': "scripts/app",
		'templates': "templates/template"
	},
	shim: {
		"underscore": {
			deps: [],
			exports: "_"
		},
		"backbone": {
			deps: ['underscore', 'jquery'],
			exports: "Backbone"
		}
	}
});
require(['app'], function(App){
	var x = new App();
	x.start();
});
