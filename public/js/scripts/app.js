/* .jshintrc eval:ignore */
Pouch.enableAllDbs = true;
window.Puton = (function() {
    //
    // Global Puton Object
    //
    var Puton = {};
    Puton = function() {
        if (Puton._app) {
            Puton._app.show();
            return;
        }
        Puton._app = new Puton.app();
        Puton._app.start();
    };

    Puton.utils = utils;

    //
    // Main Application
    //
    Puton.app = Backbone.View.extend({
        id: "puton",
        tagName: "div",
        initialize: function() {
        },
        start: function() {
            this.render();

            // disable log view
            // this.logview = new v.Log({
            //     el: this.$("#puton-log")
            // });

            this.mainPage();
        },
        render: function() {
            this.$el.html(tmpl.app());
            return this;
        },
        events: {
            "changeView": "changeView",
            "selectDB": "selectDB",
            "click h1": "mainPage",
            "click #puton-hide-button": "hide"
        },
        mainPage: function(e) {
            this.currentView = new v.Main({
                el: this.$("#puton-main")
            });
            this.currentView.render();
        },
        show: function(e) {
            this.$el.show();
        },
        hide: function(e) {
            this.$el.hide();
        },
        selectDB: function(e, dbname) {
            var that = this;
            Pouch(dbname, function(err, db) {
                if (err) {
                    console.error(err);
                    return;
                }

                var database = new m.DB(null, {db: db});
                database.fetch();
                that.changeView(null, database);
            });
        },
        changeView: function(e, model) {
            // TODO.
            // garbage collection
            this.currentView = new v.DB({
                el: this.$("#puton-main"),
                model: model
            });
            this.currentView.render();
        }
    });

    //
    // Views
    //
    var v = {};
    v.Main = Backbone.View.extend({
        initialize: function() {
            this.allDbs = [];
        },
        updateAllDbs: function() {
            var that = this;
            Pouch.allDbs(function(err, dbs) {
                that.allDbs = dbs;
                that._render();
            });
        },
        events: {
            "keydown #puton-db-input": "submit",
            "click .puton-dbname": "selectDb"
        },
        render: function() {
            this.updateAllDbs();
            return this._render();
        },
        _render: function() {
            this.$el.html(tmpl.mainView({
                allDbs: this.allDbs
            }));
            return this;
        },
        selectDb: function(e) {
            var db = $(e.target).html();
            this.dbSelected(db);
        },
        submit: function(e) {
            if (e.keyCode === 13) {
                var db = this.$("#puton-db-input").val();

                // prevent empty string
                if (db.length === 0) {
                    return;
                }

                this.dbSelected(db);
            }
        },
        dbSelected: function(db) {
            this.$el.trigger('selectDB', db);
        }
    });

    v.Log = Backbone.View.extend({
        el: "#puton-log",
        initialize: function() {
            if (window.PUTON_TESTS) {
                return;
            }

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
                var tr;
                if ($.isArray(obj)) {
                    tr = [];
                    obj.forEach(function(x) {
                        tr.push(datafy(x));
                    });
                    return tr;
                } else if (typeof obj === 'object') {
                    tr = [];
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

    v.DB = Backbone.View.extend({
        initialize: function() {
            this.listenTo(this.model, "all", this.render);
        },
        events: {
            "click #adddoc": "addDoc",
            "click #query": "query",
            "deleteDocument": "deleteDocument",
            "changeTab": "changeTab",
            "closeTab": "closeTab"
        },
        closeTab: function(e, tab) {
            this.toolbar.removeTab(tab);

            if (tab.isActive()) {
                var changeTo = this.toolbar.tabs[0];
                changeTo.view.render();
                this.toolbar.switchTo(changeTo);
            }

            this.toolbar.render();
        },
        changeTab: function(e, tab) {
            tab.view.render();
            this.toolbar.switchTo(tab);
        },
        deleteDocument: function(e, doc_id) {
            var that = this;
            that.model.db.get(doc_id, function(err, doc) {
                if (err) {
                    // TODO.
                    console.log(err);
                }

                that.model.db.remove(doc, function(err, response) {
                    that.model.docs.remove(doc_id);
                });
            });
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

                var method = self.model.db.post;

                if (typeof x._id !== 'undefined') {
                    method = self.model.db.put;
                }

                method.call(self.model.db, x, function(err, res) {
                    if (err) {
                        console.error(err);
                    }
                    self.model.db.get(res.id, function(err, res) {
                        self.model.docs.add(res, {
                            at: 0
                        });
                    });
                });

            } catch(err) {
                console.error(err);
            }
        },
        query: function() {
            var query = new v.Query({
                el: this.$(".puton-docs"),
                db: this.model.db
            });

            query.render();
            this.toolbar.addTabFor(query);
        },
        render: function() {
            this.$el.html(tmpl.db(this.model.toJSON()));

            // Toolbar
            this.toolbar = new v.Toolbar({
                el: this.$("#puton-toolbar")
            });

            var all =  new v.Documents({
                el: this.$(".puton-docs"),
                collection: this.model.docs,
                db: this.model.db
            });
            all.render();

            // add tab
            all.tabname = "Main";
            this.toolbar.addTabFor(all);
        }
    });

    v.Toolbar = Backbone.View.extend({
        initialize: function() {
            this._index = 0;
            this.tabs = [];
        },
        addTabFor: function(view) {
            this.tabs.forEach(function(tab) {
                tab.active = false;
            });

            this._index = this._index + 1;
            this.tabs.push({
                count: this._index,
                active: true,
                view: view
            });

            this.render();
        },
        switchTo: function(tabView) {
            this._active(tabView);
            this.render();
        },
        removeTab: function(tab) {
            this.tabs = _.filter(this.tabs, function(t) {
                return tab.view !== t.view;
            });
        },
        _active: function(tabView) {
            this.tabs.forEach(function(tab) {
                if (tabView.view === tab.view) {
                    tab.active = true;
                } else {
                    tab.active = false;
                }
            });
        },
        render: function() {
            this.$el.html(tmpl.toolbar());
            var that = this;
            if (this.tabs.length > 1) {
                _.each(this.tabs, function(tab) {
                    var tabView = new v.Tab(tab);
                    that.$("#puton-tab-buttons")
                        .append(tabView.render().el);
                });
            }
            return this;
        }
    });

    v.Tab = Backbone.View.extend({
        className: "puton-tab-button",
        initialize: function(options) {
            this._isActive = options.active;
            this.count = options.count;
            this.view = options.view;
        },
        events: {
            "click .puton-close-tab": "closeTab",
            "click": "changeTab"
        },
        closeTab: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.$el.trigger("closeTab", this);
        },
        changeTab: function(e) {
            this.$el.trigger("changeTab", this);
        },
        isActive: function(tab) {
            return this._isActive;
        },
        render: function() {
            if (this.view.tabname) {
                this.$el.html(tmpl.tab({
                    name: this.view.tabname
                }));
            } else {
                this.$el.html(tmpl.closeabletab({
                    name: "Query " + this.count
                }));
                this.$el.addClass("closeable");
            }

            if (this.isActive()) {
                this.$el.addClass("active");
            } else {
                this.$el.removeClass("active");
            }

            return this;
        }
    });

    v.Query = Backbone.View.extend({
        initialize: function(opts) {
            this.state = 0;
            this.db = opts.db;
            this.docs = new m.Documents(null, {db: this.db});
        },
        events: {
            'click .puton-run-query': 'runQuery'
        },
        render: function() {
            var self = this;
            if (this.state === 0) {
                this.$el.html(tmpl.queryInput());
            }

            var map = false;
            self.cm = {};
            ['map','reduce'].forEach(function(el) {
                self.cm[el]  = CodeMirror.fromTextArea(self.$el.find('.puton-code-' + el).get(0),{
                    lineNumbers: true,
                    tabSize: 4,
                    indentUnit: 4,
                    indentWithTabs: true,
                    mode: "text/javascript"
                });
            });
            self.cm.map.focus();

            this.documentsView =  new v.Documents({
                el: this.$el.find(".docs"),
                collection: this.docs
            });
            this.documentsView.render();
        },
        runQuery: function() {
            var self = this;
            var map = self.cm.map.getValue().trim();
            var reduce = self.cm.reduce.getValue().trim();
            var hasReduce;
            var query = {};


            eval("query.map = " + map);
            if (reduce) {
                eval("query.reduce = " + reduce);
                hasReduce = true;
            } else {
                hasReduce = false;
            }

            //query = {map: function (doc) {
            //    emit(doc.id, doc);
            //}};
            //hasReduce = false;
            this.db.query(query, {reduce: hasReduce, include_docs: true, conflicts: true}, function(_, res) {
                self.docs.reset();
                // TODO: proper result of key value
                // and remove edit / delete
                //console.debug(res);
                res.rows.forEach(function(x, i) {
                    self.docs.add({
                        key: x.key,
                        value: x.value
                    });
                });
            });
        }
    });

    v.Documents = Backbone.View.extend({
        initialize: function(opts) {
            this.listenTo(this.collection, "reset", this.render);
            this.listenTo(this.collection, "add", this.render);
            this.listenTo(this.collection, "remove", this.render);
            this.db = opts.db;
        },
        render: function() {
            var fragment = document.createDocumentFragment();
            var db = this.db;
            this.collection.each(function(doc){
                var docview = new v.Document({
                    model: doc,
                    db: db
                });
                fragment.appendChild(docview.render().el);
            });
            this.$el.html(tmpl.documents);
            this.$el.find('.puton-docs-container').html(fragment);
        }
    });

    v.Revisions = Backbone.View.extend({
        initialize: function(opts) {
            this.db = opts.db;
            this.doc_id = opts.doc_id;
            this.type = opts.type;
        },
        render: function() { // polymorphic: forward the method depending on type
            if (this.type === 'list') {
                this.renderList.apply(this, arguments);
            } else if (this.type === 'tree') {
                this.renderTree.apply(this, arguments);
            }
        },
        renderTree: function() {
            var $el = this.$el;
            var doc_id = this.doc_id;

            this.db.visualizeRevTree(doc_id, function(err, box) {
                if (err) {
                    return console.error(err);
                }
                $el.html(box);
            });
        },
        renderList: function() {
            var that = this;
            var $el = this.$el;
            var doc_id = this.doc_id;
            this.db.get(doc_id, {
                revs: true,
                revs_info: true
            }, function(err, doc) {
                if (err) {
                    return console.error(err);
                }

                var $fragment = $(tmpl.revisions({}));

                doc._revs_info.forEach(function(rev) {
                    var revisionView = new v.Revision({
                        db: this.db
                    });
                    var $tmp = $('<div/>');
                    $fragment.append($tmp);

                    if (rev.status === 'available') {
                        that.db.get(doc_id, {rev: rev.rev}, function(err, doc) {
                            if (err) {
                                return console.error(err);
                            }
                            $tmp.html(revisionView.render(doc, doc_id).el);
                            reRender();
                        });
                    } else {
                        $tmp.html(revisionView.render(false, doc_id).el);
                    }

                });

                function reRender() {
                    $el.html($fragment);
                }
                reRender();

            });
        }
    });

    v.Revision = Backbone.View.extend({
        className: 'puton-revision',
        render: function(doc, doc_id) {
            var model = doc;

            if (model) {
                this.$el.html(tmpl.rev_full({
                    key: model._rev,
                    value: Puton.utils.syntaxHighlight(model)
                }));
            } else {
                this.$el.html(tmpl.rev_full({
                    key: doc_id,
                    value: 'compacted'
                }));
            }

            return this;
        }
    });

    v.Document = Backbone.View.extend({
        className: "puton-doc",
        initialize: function(opts) {
            this.show = "collapsed";
            this.db = opts.db;
        },
        render: function() {
            var model = this.model;
            var key = this.model.key();

            if (this.show === "collapsed") {
                this.$el.html(tmpl.doc_collapsed({
                    key: key,
                    trunc: JSON.stringify(model.toJSON()).substring(0, 50) + "..."
                }));
            } else if (this.show === 'full') {
                this.$el.html(tmpl.doc_full({
                    key: key,
                    value: model.toJSON()
                }));

                if (!this.model.id) {
                    // TODO
                    // proper hiding of edit/delete
                    this.$el.find('.optionsbar').hide();
                }
            } else if (this.show === 'edit') {
                var modelJson = model.toJSON();
                ['_rev','_id'].forEach(function(key) {
                    if (key in modelJson) {
                        delete modelJson[key];
                    }
                });

                this.$el.html(tmpl.doc_edit({
                    key: key,
                    code: JSON.stringify(modelJson, undefined, 4)
                }));

                this.codeEdit = CodeMirror.fromTextArea(
                    this.$el.find('.puton-code-edit').get(0),
                    {
                        lineNumbers: false,
                        tabSize: 4,
                        indentUnit: 4,
                        indentWithTabs: true,
                        mode: "application/json",
                        autofocus: true
                    }
                );

            }
            return this;
        },
        saveEdit: function(e) {
            var self = this;
            e.preventDefault();
            e.stopPropagation();

            var json = this.codeEdit.getValue().trim();
            try {
                if (!json || json[0] !== '{' ||
                    json[json.length-1] !== '}' ||
                    (json = JSON.parse(json)) === false) {
                    throw("Not a valid object");
                }

                json._id = (self.model.toJSON())._id;
                json._rev = (self.model.toJSON())._rev;

                self.db.put(json, function(err, res) {
                    if (err) {
                        return console.error(err);
                    }

                    self.db.get(json._id, function(err, res) {
                        if (err) {
                            return console.error(err);
                        }

                        self.model.set(res);
                        self.show = "full";
                        self.render();
                    });
                });
            } catch (err) {
                console.error(err);
                this.show = "full";
                this.render();
            }
        },
        cancelEdit: function(e) {
            e.preventDefault();
            e.stopPropagation();

            this.show = "full";
            this.render();
        },
        events: {
            "click .revoption": "revOption",
            "click .revtreeoption": "revTreeOption",
            "click .editoption": "editOption",
            "click .deleteoption": "deleteOption",
            "click": "toggleView",
            "click .puton-code-edit-save": "saveEdit",
            "click .puton-code-edit-cancel": "cancelEdit"
        },
        editOption: function(e) {
            e.preventDefault();
            e.stopPropagation();

            this.show = 'edit';
            this.render();
        },
        deleteOption: function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (confirm("Delete Document?")) {
                // this.model.id
                this.$el.trigger("deleteDocument", this.model.id);
            }
        },
        revOption: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var revisions = new v.Revisions({
                el: $(".puton-revs-container"),
                db: this.db,
                doc_id: (this.model.toJSON())._id,
                type: 'list'
            });
            revisions.render();
        },
        revTreeOption: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var revisions = new v.Revisions({
                el: $(".puton-revs-container"),
                db: this.db,
                doc_id: (this.model.toJSON())._id,
                type: 'tree'
            });
            revisions.render();
        },
        toggleView: function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (this.show === 'edit') {
                return;
            }

            this.show = this.show === "collapsed" ?
                "full" : "collapsed";

            this.render();
        }
    });

    Puton.views = v;

    //
    // Models
    //
    var m = {};

    Backbone.Model.prototype.idAttribute = "_id";

    m.Document = Backbone.Model.extend({
        key: function() {
            return this.get('key') || this.id;
        }
    });

    m.Documents = Backbone.Collection.extend({
        model: m.Document,
        initialize: function(models, options) {
            var that = this;
            this.db = options.db;
        },
        fetch: function() {
            var that = this;
            this.db.allDocs({
                include_docs: true
            }, function(err, res) {
                that.add(_.pluck(res.rows, "doc"));
            });
        }
    });

    m.DB = Backbone.Model.extend({
        initialize: function(attr, options) {
            this.db = options.db;
            this.docs = new m.Documents(null, {db: this.db});
            this.docs.fetch();
        },
        fetch: function() {
            var that = this;
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

    Puton.models = m;

    return Puton;
})();
