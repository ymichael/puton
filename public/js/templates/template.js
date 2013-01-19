/*global define:true *//*jshint  multistr:true*/
define(['underscore'], function(_) {

// ## Templates
var tmpl = {};

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
<h3 class='key'><%- key %></h3>\
<pre class='value'><%= value %></pre>\
";

tmpl.doc_collapsed = "\
<span class='key'><%- key %></span>\
&nbsp;\
<span class='value'><%- trunc %></span>\
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
<div id='toolbar'>\
    <a class='button' id='query'>Query</a>\
	<a class='button' id='adddoc'>Add document</a>\
</div>\
<div id='tabs'>\
<div class='tab'>\
<div id='docs'></div>\
</div>\
</div>\
";

// ## Compile templates/partials
var compiled = {};
_.each(_.keys(tmpl), function(key){
    compiled[key] = _.template(tmpl[key]);
});
return compiled;
});