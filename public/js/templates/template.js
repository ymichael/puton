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
    ";

    tmpl.tabs = "\
        <div class='docs'></div>\
    ";

    tmpl.queryInput = "\
        <textarea class='map' name='map'></textarea>\
        <textarea class='reduce' name='reduce'></textarea>\
        <button class='run'>Run Query</button>";

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
        </div>\
        <div id='tabs'>\
        <div class='docs'></div>\
        </div>\
    ";

    tmpl.toolbar = "\
		<a class='button' id='query'>Run Query</a>\
        <a class='button' id='adddoc'>Add document</a>\
        <div id='tabbuttons'></div>\
    ";

    tmpl.tabbutton = "<a class='tabbutton><%- label %></a>";

    // ## Compile templates/partials
    var compiled = {};
    _.each(_.keys(tmpl), function(key){
        compiled[key] = _.template(tmpl[key]);
    });
    return compiled;

});