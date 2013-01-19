/*global define:true, bootstrap:true*/
define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, tmpl) {
    var App = Backbone.View.extend({
        start: function() {
            console.log('asdf');
        }
    });
    return App;
});