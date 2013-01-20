/*global define:true, prompt alert bootstrap:true*/
define([
    'jquery',
    'underscore',
    'backbone',
    'pouch',
    'templates'
], function ($, _, Backbone, Pouch, tmpl) {
    
    // stolen from SO.
    function syntaxHighlight(json) {
        if (typeof json !== 'string') {
             json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    var Log = Backbone.View.extend({
        el: "#log",
        initialize: function() {
            var self = this;
            self.count = 0;

            ['log','info','error'].forEach(function(type) {
                var orin = console[type];
                console[type] = function(str) {
                    orin.call(console, arguments[0]);
                    self.log(str, type);
                    //orin.apply(console, Array.prototype.splice.call(arguments));
                };
            });
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
                    $('<div class="log-'+type+'"/>').tree( {
                        data: datafy(str),
                        autoOpen: true,
                        slide: false
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
            this.logview = new Log();
            this.currentView = new v.Main({
                el: this.$("#main")
            });

            // tmp.
            this.selectDB(null, "idb://test");
        },
        events: {
            "changeView": "changeView",
            "selectDB": "selectDB"
        },
        selectDB: function(e, dbname) {
            var that = this;
            Pouch(dbname, function(err, db) {
                if (err) {
                    console.error(err);
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
        events: {
            "click #adddoc": "addDoc",
            "click #query": "query"
        },
        addDoc: function(e) {
            var self = this;
            var x = prompt("Document: ", '{}').trim();
            try {
                if (x.length === 0 || x[0] !== '{' || x[x.length-1] !== '}') {
                    throw("Not a valid object");
                }
                try {
                    x = JSON.parse(x);
                } catch (err) {
                    eval("x="+x);
                }

                if (typeof x !== 'object') {
                    throw("Not a valid object");
                }

                self.model.db.put(x, function(err, res) {
                    if (err) {
                        console.error(err);
                    }
                    self.model.db.get(res.id, function(err, res) {
                        self.model.docs.add(res);
                    });
                });

            } catch(err) {
                console.error(err);
            }
        },
        query: function() {

        },
        render: function() {
            this.$el.html(tmpl.db(this.model.toJSON()));
            this.docview = new v.Documents({
                el: this.$(".docs"),
                collection: this.model.docs
            });
            this.docview.render();
        }
    });

    v.Query = Backbone.View.extend({
        initialize: function() {
            this.state = 0;
        },
        render: function() {
            if (this.state === 0) {
                this.$el.html(tmpl.queryInput);
            }
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
        initialize: function() {
            this.show = "collapsed";
        },
        render: function() {
            var model = this.model;
            if (('key' in model) === false) {
                model.key = model.id;
            }
            if (this.show === "collapsed") {
                this.$el.html(tmpl.doc_collapsed({
                    key: this.model.id,
                    trunc: JSON.stringify(model.toJSON()).substring(0, 20) + "..."
                }));
            } else {
                this.$el.html(tmpl.doc_full({
                    key: this.model.id,
                    value: syntaxHighlight(model.toJSON())
                }));
            }
            return this;
        },
        events: {
            "click": "toggleView"
        },
        toggleView: function(e) {
            this.show = this.show === "collapsed" ?
                "full" : "collapsed";

            this.render();
        }
    });

    v.Tab = Backbone.View.extend({
        initialize: function() {

        },
        render: function() {
            var model = this.model;
            this.$el.html(tmpl.tab({
                name: model.name
            }));
        }
    });
    v.Tabs = Backbone.View.extend({
        initialize: function() {
            this.listenTo(this.collection, "all", this.render);
        },
        render: function() {
            var fragment = document.createDocumentFragment();
            this.collection.each(function(tab){
                var tabview = new v.Tab({
                    model: tab
                });
                fragment.appendChild(tabview.render().el);
            });
            this.$el.html(fragment);
        }
    });

    var m = {};

    Backbone.Model.prototype.idAttribute = "_id";

    m.Document = Backbone.Model.extend({});
    m.Documents = Backbone.Collection.extend({
        initialize: function(models, options) {
            var that = this;
            this.db = options.db;
            this.db.allDocs({include_docs: true}, function(err, res) {
                that.add(_.pluck(res.rows, "doc"));
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

    m.Tab = Backbone.Model.extend({});
    m.Tabs = Backbone.Collection.extend({
        initialize: function(models, options) {
            var that = this;
        },
        model: m.Tab
    });

    return App;
});