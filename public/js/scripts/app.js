/*global define:true, alert bootstrap:true*/
define([
    'jquery',
    'underscore',
    'backbone',
    'pouch',
    'templates'
], function ($, _, Backbone, Pouch, tmpl) {
    var Log = Backbone.View.extend({
        el: "#log",
        initialize: function() {
            var that = this;
            console.yo = console.log;
            console.log = function(str){
                that.log(str);
                console.yo(str);
            };
        },
        log: function(str) {
            this.$el.append(tmpl.log({log: str}));
        }
    });
    var App = Backbone.View.extend({
        el: "#container",
        initialize: function() {
            
        },
        start: function() {
            // this.logview = new Log();
            this.currentView = new Main({
                el: this.$("#main")
            });
        },
        events: {
            "changeView": "changeView",
            "selectDB": "selectDB"
        },
        selectDB: function(e, dbname) {
            var that = this;
            Pouch(dbname, function(err, db) {
                if (err) {
                    // TODO.
                    alert(err);
                    return;
                }

                var database = new m.DB(null, {db: db});

                // that.changeView(null, new m.DB(db));
            });
        },
        changeView: function(e, model) {

        }
    });

    var Main = Backbone.View.extend({
        events: {
            "keydown #db": "submit"
        },
        submit: function(e) {

            if (e.keyCode === 13) {
                var dbname = this.$("#db").val();

                // prevent empty string
                if (dbname.length === 0) {
                    // noop.
                    return;
                }

                this.$el.trigger('selectDB', dbname);
            }
        }
    });

    var DB = Backbone.View.extend({
        initialize: function() {

        },
        render: function() {
            this.collection.each(function(doc){

            });
        }
    });

    var m = {};
    m.DB = Backbone.Model.extend({
        initialize: function(attr, options) {
            this.db = options.db;
            // bootstrap data
            this.db.info(function(err, info) {

            });
        }
    });

    return App;
});