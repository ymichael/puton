#!/usr/bin/env node

// Module Dep
var express = require('express');
var http = require('http');
var app = express();

// Server
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

// Production 
app.configure('production', function(){
    app.use(express.errorHandler());
    app.use(express.compress());
    app.use(express["static"](__dirname + "/dist"));
});

// Development
app.configure('development', function(){
    app.use(require('less-middleware')({
        src: __dirname + '/public',
        force: true
    }));
    app.use(express["static"](__dirname + "/public"));
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
    app.use(express.logger('dev'));
});

var bookmarklet;
var production = process.env.NODE_ENV === "production";
if (production) {
    // Main Page
    bookmarklet = [
    "javascript:(function() {",
        "window.PUTON_HOST = window.PUTON_HOST || 'http://puton.jit.su/';",
        // puton
        "var puton = document.createElement('script');",
        "puton.setAttribute('src', PUTON_HOST + 'release/puton.min.js');",
        "document.body.appendChild(puton);",

        // css
        "var css = document.createElement('link');",
        "css.setAttribute('rel', 'stylesheet');",
        "css.setAttribute('type', 'text/css');",
        "css.setAttribute('href', PUTON_HOST + 'release/puton.css');",
        "document.body.appendChild(css);",
    "})()"
    ].join('');
} else {
    bookmarklet = [
    "javascript:(function() {",
        "window.PUTON_HOST = window.PUTON_HOST || 'http://puton.jit.su/';",
        // we include jQuery first to make our lives easier.
        "var jq = document.createElement('script');",
        "jq.setAttribute('src', PUTON_HOST + 'js/libs/jquery.js');",
        "document.body.appendChild(jq);",
        "jq.onload=function(){",
            // load actual bookmarklet after jquery is injected
            "var js = document.createElement('script');",
            "js.setAttribute('src', window.PUTON_HOST + 'js/bookmarklet.js');",
            "document.body.appendChild(js);",
        "};",
    "})()"
    ].join('');
}

// Routes
app.get('/', function(req, res) {
    var variables = {
        bookmarklet: bookmarklet
    };
    res.render('index', variables);
});

// Start Server
var port = process.env.PORT || 3000;
http.createServer(app).listen(port, function() {
    console.log("Puton started, listening on port %d in %s mode", port, app.settings.env);
});
