/*global define:true, alert bootstrap:true*/
define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, tmpl) {
    var App = Backbone.View.extend({
        el: "#container",
        start: function() {
            var mainview = new Main({
                el: this.$("#main")
            });
        }
    });

    var Main = Backbone.View.extend({
        events: {
            "keydown #db": "submit"
        },
        submit: function(e) {
            console.log(e);
            if (e.keyCode === 13) {
                alert($("#db").val());
            }
        }
    });
    return App;
});