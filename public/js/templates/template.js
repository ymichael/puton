/*global define:true *//*jshint  multistr:true*/
define(['underscore'], function(_) {

// ## Templates
var tmpl = {};

// ## Compile templates/partials
var compiled = {};
_.each(_.keys(tmpl), function(key){
    compiled[key] = _.template(tmpl[key]);
});
return compiled;
});