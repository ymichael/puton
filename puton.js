#!/usr/bin/env node

// Module Dep
var connect = require('connect');
var jade = require('jade');
var fs = require('fs');
var production = process.env.NODE_ENV === "production";

// Server
var server = connect();
server.use(connect.logger("dev"));

// Production
var bookmarklet;
if (production) {
    server.use(connect["static"](__dirname + "/dist"));
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
    server.use(connect["static"](__dirname + "/public"));
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

// (taken from serve)
server.use(function(req, res, next) {
    if (req.url !== "/") {
        return next();
    }
    var file = __dirname + "/index.jade";
    fs.readFile(file, "utf8", function(err, str) {
        if (err) {
            return next(err);
        }
        try {
            var fn = jade.compile(str, {
                filename: file,
                pretty: true
            });

            str = fn({
                bookmarklet: bookmarklet
            });
            res.setHeader("Content-Type", "text/html");
            res.setHeader("Content-Length", Buffer.byteLength(str));
            res.end(str);
        } catch (err) {
            next(err);
        }
    });
});

// Start Server
var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log('\033[90mserving \033[36mputon\033[90m on port \033[96m%d\033[0m', port);
});
