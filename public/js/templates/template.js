/*jshint multistr:true*/

// ## Templates
var tmpl = {};

tmpl.app = "\
<div id='puton-container'>\
    <h1 id='puton-heading'>Puton</h1>\
    <div id='puton-main'></div>\
    <a id='puton-hide-button'></a>\
    <div id='puton-log'></div>\
</div>";

tmpl.mainView = "\
\
<div class='puton-section'>\
    <h2>Open a Pouch:</h2>\
    <div class='puton-main-input'>\
        <label class='puton-db-label' for='puton-db-input'>Pouch(</label>\
        <input type='text' id='puton-db-input'/>\
        <label class='puton-db-label' for='puton-db-input'>);</label>\
    </div>\
</div>\
\
<div class='puton-section'>\
    <h2>Existing Pouches:</h2>\
    <%  if (allDbs.length === 0) { %>\
        <p class='puton-db-info'>No Existing Pouches :(</p>\
    <%  } else { %>\
        <ul class='puton-dbnames'>\
            <%  _.each(allDbs, function(db) { %>\
                <li class='puton-dbname'><%= db %></li>\
            <% }) %>\
        </ul>\
    <% } %>\
</div>";

tmpl.addDocForm = "\
<div class='puton-caret'>\
    <div class='puton-innercaret'></div>\
    <div class='puton-outercaret'></div>\
</div>\
<textarea class='puton-add-doc-form' name='addDocForm'>{\n\
\n\
\n\
\n\}</textarea>\
<button class='puton-code-edit-cancel'>Cancel</button>\
<button class='puton-code-edit-save'>Save</button>";

tmpl.log = "\
<p class='log log-<%- type %>'>\
    <b>\
        <small class='count'>\
            <%- count %>\
        </small>\
    </b>\
    <%- log %>\
</p>";

tmpl.db = "\
<h2 id='puton-dbname'><%- db_name %></h2>\
<p class='puton-dbinfo'>\
    &middot;\
    <b>doc_count: </b>\
    <%- doc_count %>\
    &middot;\
    <b>update_seq: </b>\
    <%- update_seq %>\
</p>\
<div id='puton-toolbar'></div>\
<div id='puton-tabs'>\
    <div class='puton-docs'></div>\
</div>";

tmpl.doc_full = "\
<h3 class='puton-doc-key'><%- key %><small><%- rev%></small></h3>\
<div class='puton-doc-optionsbar'>\
<a class='option revtreeoption'>rev-tree</a>&nbsp;\
<a class='option revoption'>rev-list</a>&nbsp;\
<a class='option editoption'>edit</a>&nbsp;\
<a class='option deleteoption'>delete</a>\
</div>\
<pre class='puton-json-view'><code><%= Puton.utils.syntaxHighlight(value) %></code></pre>";

tmpl.doc_collapsed = "\
<h3 class='puton-doc-key'><%- key %><small><%- rev%></small></h3>\
<pre class='puton-json-view'><code><%= Puton.utils.syntaxHighlight(trunc) %><code></pre>";

tmpl.doc_edit = "\
<h3 class='puton-doc-key'><%- key %><small><%- rev %></small></h3>\
<textarea class='puton-code-edit' name='code'><%= code %></textarea>\
<button class='puton-code-edit-cancel'>Cancel</button>\
<button class='puton-code-edit-save'>Save</button>";

tmpl.tabs = "\
<div class='docs'></div>";

tmpl.queryInput = "\
    Map: \
    <textarea class='puton-code-edit puton-code-map' name='map'>function(doc) {\n\
\n\
\n\
\n\
\n\}</textarea>\
<br/>\
    Reduce: \
    <textarea class='puton-code-edit puton-code-reduce' name='reduce'>\
\n\
\n\
\n\
\n\
\n\
\n\</textarea>\
<button class='puton-run-query'>Run Query</button>\
<div class='docs'></div>";

tmpl.toolbar = "\
<a class='button' id='query'>Run Query</a>\
<a class='button' id='adddoc'>Add document</a>\
<div id='puton-tab-buttons'></div>";

tmpl.documents = "\
<div class='puton-docs-container'></div>\
<div class='puton-revs-container'></div>";

tmpl.revisions = "<div class='revisions'></div>";

tmpl.rev_full = "\
<h3 class='puton-doc-key'><%- key %></h3>\
<pre class='puton-json-view'><code><%= value %></code></pre>";

tmpl.tabbutton = "<a class='tabbutton><%- label %></a>";
tmpl.tab = "<span><%- name %></span>";
tmpl.closeabletab = "<span><%- name %></span><div class='puton-close-tab'></div>";

// ## Compile templates/partials
var compiled = {};
_.each(_.keys(tmpl), function(key){
    compiled[key] = _.template(tmpl[key]);
});
tmpl = compiled;
