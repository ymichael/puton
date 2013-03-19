// ## Templates
var tmpl = {};

tmpl.app = "\
<h1>Puton</h1>\
<div id='puton-main'>\
    <b><label for='db'>db name: </label></b>\
    <input type='text' id='db'/>\
</div>\
<a href='#' id='hide-button'>Close</a>\
<div id='log'></div>\
";



tmpl.log = "\
    <p class='log log-<%- type %>'>\
    	<b>\
    		<small class='count'>\
    			<%- count %>\
    		</small>\
    	</b>\
    	<%- log %>\
    </p>\
";


tmpl.doc_full = "\
<div class='optionsbar'>\
    <a class='option editoption'>edit</a>\
    &nbsp;|&nbsp;\
    <a class='option deleteoption'>delete</a>\
</div>\
<h3 class='key'><%- key %></h3>\
<pre class='value'><%= value %></pre>\
";

tmpl.doc_collapsed = "\
    <span class='key'><%- key %></span>\
    &nbsp;\
    <span class='value'><%- trunc %></span>\
";

tmpl.doc_edit = "\
    <textarea class='code-edit' name='code'><%= code %></textarea>\
    <button class='code-edit-save'>Save</button>\
";

tmpl.tabs = "\
    <div class='docs'></div>\
";

tmpl.queryInput = "\
    Map: \
    <textarea class='code-edit code-map' name='map'>function(doc) {\n\
\n\
\n\}</textarea>\
    Reduce: \
    <textarea class='code-edit code-reduce' name='reduce'></textarea>\
    <button class='run'>Run Query</button>\
    <div class='docs'></div>\
    \
";

tmpl.db = "\
    <h2><%- db_name %></h2>\
    <small>(database name)</small>\
    <p>\
        <b>doc_count: </b>\
        <%- doc_count %>\
    </p>\
    <p>\
        <b>update_seq: </b>\
        <%- update_seq %>\
    </p>\
    <div id='puton-toolbar'>\
    </div>\
    <div id='tabs'>\
    <div class='docs'></div>\
    </div>\
";

tmpl.toolbar = "\
	<a class='button' id='query'>Run Query</a>\
    <a class='button' id='adddoc'>Add document</a>\
    <div id='puton-tabbuttons'></div>\
";

tmpl.tabbutton = "<a class='tabbutton><%- label %></a>";

// ## Compile templates/partials
var compiled = {};
_.each(_.keys(tmpl), function(key){
    compiled[key] = _.template(tmpl[key]);
});
tmpl = compiled;
