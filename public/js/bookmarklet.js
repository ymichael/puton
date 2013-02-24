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
            src: "js/libs/sandbox.js",
            dep: ['app']
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
    
    // inefficient, but works
    function generateLoadOrder(srcList) {
        function getDepth(src) {
            if (typeof srcList[src] === 'undefined') throw('Dependency ' + src + 'not defined');
            if (typeof srcList[src].dep === 'undefined') return 0;
            var d = 0;
            for (var i=0;i<srcList[src].dep.length;++i) {
                var nd = getDepth(srcList[src].dep[i]);
                if (nd > d) d = nd;
            }
            return d+1;
        }
        var tr = [], depth;
        for (var src in srcList) {
            if (srcList.hasOwnProperty(src)) {
                depth = getDepth(src);
                if (typeof tr[depth] === 'undefined') tr[depth] = [];
                tr[depth].push(src);

            }
        }
        return tr;
    }

    // decide the order to load the scripts
    // TODO
    // generate this array from code.
    var loadOrder = generateLoadOrder(srcList);

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
        };

        script.forEach(function(js) {
            var js = scriptTag(srcList[js].src);
            document.body.appendChild(js);
            js.onload = next;
        });
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
