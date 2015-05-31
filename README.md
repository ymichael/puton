# Puton (Futon for PouchDB)

__**Puton is no longer maintained. Check out the [PouchDB inspector for Chrome](https://chrome.google.com/webstore/detail/pouchdb-inspector/hbhhpaojmpfimakffndmpmpndcmonkfa) and [PouchDB inspector for Firefox](https://addons.mozilla.org/en-US/firefox/addon/pouchdb-inspector/)__

Puton is to [PouchDB][1] what Futon is to [CouchDB][2].

The general idea is to provide a simple way to inspect a browser's `PouchDB`.

There are several constraints in this regards _(same origin policy being one of them)_. Consequently, Puton is implemented as a javascript bookmarklet so that it can be injected into the relevant pages and access the pages' pouchdb documents.

## Developing puton
To get started, run the following commands:

- install grunt-cli
```
$ npm install -g grunt-cli
```

- install npm dependencies
```
$ npm install
```

- starts puton
```
node puton.js
```

- starts puton in production mode
```
$ NODE_ENV=production node puton.js
```

#### Grunt tasks
- `lint`
    - Lint the various files
- `build:all`
    - concatenate lib files
    - uglify lib files
    - `grunt build`
- `build`
    - concatenate script files
    - uglify script files
    - concat `lib.min` with `script.min`
- `minify`
    - minify css files
- `updatelibs`
    - Updates Backbone, Underscore, jQuery
    - `build:lib`
- `updatepouch`
    - Update Pouch to latest version
- `test`
    - Runs Jasmine tests
- `browser`
    - Starts Connect Server to serve tests at http://localhost:9001
- `release` __(default task)__
    - `lint`
    - `updatepouch`
    - `test`
    - `build`
    - `minify`
- `run`: Starts Puton


[1]: http://pouchdb.com/
[2]: http://couchdb.apache.org/
