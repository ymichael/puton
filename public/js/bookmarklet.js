$(function() {
    // styles
    var loadStyle = function (href) {
        var css = $("<link>");
        css.attr('rel', 'stylesheet');
        css.attr('type', 'text/css');
        css.attr('href', PUTON_HOST + href);
        $("body").append(css);
    };
    loadStyle("css/style.css");
    loadStyle("css/codemirror.css");
   
    //
    // load scripts.
    var scriptTag = function(src) {
        var js = document.createElement('script');
        js.src = PUTON_HOST + src;
        return js;
    };

    var scripts = [
        "js/libs/jquery.tree.js",
        "js/libs/underscore.js",
        "js/libs/codemirror.js",
        "js/libs/backbone.js",
        "js/libs/pouch.js",
        "js/libs/sandbox.js",
        "js/templates/template.js",
        "js/scripts/app.js",
        "js/scripts/start.js"
    ];

    var loadScripts = function(scripts) {
        if (scripts.length === 0) {
            return;
        }

        var js = scriptTag(scripts.shift());
        document.body.appendChild(js);
        js.onload = function() {
            loadScripts(scripts);
        };
    };

    // load scripts sequentially.
    loadScripts(scripts);
});



