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

    var srcList = {
        "backbone": {
            src: "js/libs/backbone.js",
            dep: ["underscore"],
        },
        "underscore": {
            src: "js/libs/underscore.js"
        },
        "codemirror": {
            src: "js/libs/codemirror.js"
        },
        "sandbox": {
            src: "js/libs/sandbox.js"
        },
        "pouch": {
            src: "js/libs/pouch.js",
        },
        "jquery.tree": {
            src: "js/libs/jquery.tree.js"
        },
        "tmpl" : {
            src: "js/templates/template.js"
        },
        "app": {
            src: "js/scripts/app.js",
            dep: ['backbone']
        },
        "start": {
            src: "js/scripts/start.js",
            dep: ["app"]
        }
    };
    
    // decide the order to load the scripts
    // TODO
    // generate this array from code.
    var loadOrder = [
        ["underscore", "codemirror", "pouch", "jquery.tree"],
        ["backbone", "sandbox", "tmpl"],
        ["app"],
        ["start"]
    ];

    var loadScripts = function(scripts) {
        if (scripts.length === 0) {
            return;
        }

        var script = scripts.shift();
        var len = script.length;
        var loaded = 1;
        var next = function() {
            if (loaded === len) {
                loadScripts(scripts);
            } else {
                loaded++;
            }
        }

        script.forEach(function(js) {
            var js = scriptTag(srcList[js].src);
            document.body.appendChild(js);
            js.onload = next;
        })
    };

    // load scripts sequentially.
    loadScripts(loadOrder);



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
