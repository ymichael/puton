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
            this.count = 0;
            var that = this;
            console.yo = console.log;
            console.ynfo = console.info;

            console.log = function(str){
                that.log(str, "log");
                console.yo.apply(console, Array.prototype.splice.call(arguments));
            };

            console.info = function(str) {
                that.log(str, "info");
                console.ynfo.apply(console, Array.prototype.splice.call(arguments));
            };
        },
        log: function(str, type) {
            type = type || "log";

            function datafy(obj) {
                if ($.isArray(obj)) {
                    obj.map(function(x) {
                        return datafy(x);
                    });
                    return obj;
                } else if (typeof obj === 'object') {
                    var tr = [];
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            tr.push( {
                                label: key,
                                children: datafy(obj[key])
                            });
                        }
                    }
                    return tr;
                } else {
                    return [{label: obj}];
                }
            }
            if (typeof str === 'object') {
                this.$el.prepend(
                    $('<div/>').tree( {
                        data: datafy(str)
                    }));
            } else {

                this.$el.prepend(tmpl.log({
                    count: ++this.count,
                    log: str,
                    type: type
                }));
            }
        }
    });


    var App = Backbone.View.extend({
        el: "#container",
        initialize: function() {
            
        },
        start: function() {
            // this.logview = new Log();
            this.currentView = new v.Main({
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

                // tmp.
                window.db = db;

                var database = new m.DB(null, {db: db});

                that.changeView(null, database);
            });
        },
        changeView: function(e, model) {
            // TODO.
            // garbage collection
            this.currentView = new v.DB({
                el: this.$("#main"),
                model: model
            });
            this.currentView.render();
        }
    });

    var v = {};

    v.Main = Backbone.View.extend({
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

    v.DB = Backbone.View.extend({
        initialize: function() {
            this.listenTo(this.model, "all", this.render);
        },
        render: function() {
            this.$el.html(tmpl.db(this.model.toJSON()));
            this.docview= new v.Documents({
                el: this.$("#docs"),
                collection: this.model.docs
            });
            this.docview.render();
        }
    });

    v.Documents = Backbone.View.extend({
        initialize: function() {
            this.listenTo(this.collection, "all", this.render);
        },
        render: function() {
            var fragment = document.createDocumentFragment();
            this.collection.each(function(doc){
                var docview = new v.Document({
                    model: doc
                });
                fragment.appendChild(docview.render().el);
            });
            this.$el.html(fragment);
        }
    });

    v.Document = Backbone.View.extend({
        className: "doc",
        render: function() {
            console.log(this.model.toJSON());
            this.$el.html(tmpl.doc(this.model.toJSON()));
            return this;
        }
    });

    var m = {};
    m.Document = Backbone.Model.extend({});
    m.Documents = Backbone.Collection.extend({
        initialize: function(models, options) {
            var that = this;
            this.db = options.db;
            this.db.allDocs(function(err, res) {
                that.add(res.rows);
            });
        },
        model: m.Document
    });

    m.DB = Backbone.Model.extend({
        initialize: function(attr, options) {
            var that = this;
            this.db = options.db;
            this.docs = new m.Documents(null, {db: this.db});
            
            // bootstrap database
            this.db.info(function(err, info) {
                that.set(info);
            });
        },
        defaults: {
            "db_name": "",
            "doc_count": "",
            "update_seq": ""
        }
    });

    return App;
});