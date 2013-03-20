# Puton (Futon for PouchDB)
[![Nodejitsu Deploy Status Badges](https://webhooks.nodejitsu.com/ymichael/puton.png)](https://webops.nodejitsu.com#nodejitsu/webhooks)

Puton is to [PouchDB][1] what Futon is to [CouchDB][2].

The general idea is to provide a simple way to inspect a browser's `PouchDB`.

There are several constraints in this regards _(same origin policy being one of them)_. Consequently, Puton is implemented as a javascript bookmarklet so that it can be injected into the relevant pages and access the pages' pouchdb documents.

## Developing puton
To get started, run the following commands:

```sh
# install grunt-cli
$ npm install -g grunt-cli

# install npm dependencies
$ npm install

# starts puton
$ node puton.js
```

[1]: http://pouchdb.com/
[2]: http://couchdb.apache.org/
