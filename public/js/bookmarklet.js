$(function() {
    // styles
    var loadStyle = function (href) {
        var css = $("<link>");
        css.attr('rel', 'stylesheet');
        css.attr('type', 'text/css');
        css.attr('href', window.PUTON_HOST + href);
        $("body").append(css);
    };
    loadStyle("css/style.css");
    loadStyle("css/codemirror.css");
   
    // load scripts.
    var loadScript = function(src) {
        var js = $('<script>');
        js.attr('src', window.PUTON_HOST + src);
        $("body").append(js);
    };

    loadScript("js/libs/jquery.tree.js");
    loadScript("js/libs/underscore.js");
    loadScript("js/libs/codemirror.js");
    loadScript("js/libs/backbone.js");
    loadScript("js/libs/pouch.js");
    loadScript("js/libs/sandbox.js");
    loadScript("js/templates/template.js");
    loadScript("js/scripts/app.js");
    loadScript("js/scripts/start.js");

// create divs
var markup = "\
<div id='puton-container'>\
    <h1>Puton</h1>\
    <div id='puton-main'>\
        <b><label for='db'>db name: </label></b>\
        <input type='text' id='db'/>\
    </div>\
    <div id='log'></div>\
</div>\
";
$(markup).appendTo($("body"));
});



