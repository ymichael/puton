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

    var _scripts = {
        "js/libs/jquery.tree.js": function() {
            return $ && $('body') && $('body').tree;
        },
        "js/libs/underscore.js": function() {
            return _ && _.each;
        },
        "js/libs/codemirror.js": function() {
            return CodeMirror && CodeMirror.version;
        },
        "js/libs/backbone.js": function() {
            return Backbone && Backbone.VERSION;
        },
        "js/libs/pouch.js": function() {
            return Pouch;
        },
        "js/libs/sandbox.js": function() {
            return false;
        },
        "js/templates/template.js": function() {
            return false;
        },
        "js/scripts/app.js": function() {
            return false;
        },
        "js/scripts/start.js": function() {
            return false;
        }
    };
    var scripts = [];
    for (var src in _scripts) {
        scripts.push({src: src, condition: _scripts[src]});
    }

    var loadScripts = function(scripts) {
        if (scripts.length === 0) {
            return;
        }

        var continuation = function() {
            loadScripts(scripts);
        };

        var script = scripts.shift();
        var loaded = false;
        try {
            if (script.condition && script.condition()) {
                loaded = true;
                continuation();
            }
        } catch(e) {
        } finally {
            if (!loaded) {
                var js = scriptTag(script.src);
                document.body.appendChild(js);
                js.onload = continuation;
            }
        }
    };



    // load scripts sequentially.
    loadScripts(scripts);



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
