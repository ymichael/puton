// This file contains the necessary helper functions
// to map a CouchDB HTTP Document API
// into a PouchDB API

// See http://wiki.apache.org/couchdb/HTTP_Document_API
// and http://pouchdb.com/api.html


// todo: support attachment
// todo: cache dbs that are already opened

var PouchREST = (function(Pouch) {

    if (!Pouch) {
        throw(new Error('Pouch not defined in global namespace'));
    }

    function parseURL(url) {
        var i;

        url = url.replace(/^(http:\/\/)|(https:\/\/)/,'');
        url = url.split('/',2);

        if (url.length === 2) {

            var database = null;

            // find the last '/'
            for (i=url[1].length-1;i>=0;--i) {
                if (url[1][i] === '/') {
                    // everything preceding this is the database name
                    // todo: build the string
                    for (var j=0;j<i;++j) {
                        database += url[1][j];
                    }
                    break;
                }
            }
            
            var action = '';
            for (i=i+1;i<url[1].length;++i) {
                action += url[1][i];
            }
            action = parseAction(action);

            return {
                database: database,
                action: action.action,
                option: action.option
            };
        } else {
            throw(new Error("Invalid URL"));
        }

    }

    function parseAction(action) {
        action = action.split('?', 2);

        var options = {};
        if (action.length === 2) {
            options = parseOption(action[1]);
        }

        return {
            action: action[0],
            option: option
        };
    }

    // converts querystring into a js object
    // e.g rev=123&revs_info=true => {rev: 123, revs_info: true}
    function parseOption(option) {
        var tr = {};
        option = option.split('&');
        for (var i=0;i<options.length;++i) {
            var tmp = options[i].split('=' ,2);
            if (tmp.length === 2) {
                tr[tmp[0]] = tmp[1];
            }
        }
        return tr;
    }

    if (!(''.trim)) String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

    return function PouchREST(verb, url, param, cb) {
        
        // sanitize verb
        verb = verb.trim().toUpperCase();
        url = parseURL(url);

        if (!url.database) {
            throw(new Error("PouchREST: No Database specified"));
        }

        if (verb === 'GET') {
            
            if (url.database === '_all_dbs') {
                throw(new Error("PouchREST: PouchDB does not support _all_dbs"));
            }

            Pouch('idb://' + url.database, function(err, db) {
                if (err) throw(err);

                if (url.action === '_all_docs') {
                    db.allDocs(url.option, cb);
                } else if (url.action) {
                    db.get(url.action, url.option, cb);
                } else {
                    throw(new Error("PouchREST: PouchDB does not have any information about its databases"));       
                }
            });
        } else if (verb === 'PUT') {
            if (!url.action) {
                // create database
                Pouch('idb://'+url.database, url.option, cb);
            } else {
                Pouch('idb://' + url.database, function(err, db) {
                    if (err) throw(err);

                    var _id = url.action;
                    if (typeof param === 'string') {
                        param = JSON.parse(param);
                    }
                    if (typeof param !== 'object') { 
                        throw(new Error('PouchREST: PUT document expects JS object for document update'));
                    }

                    param._id = _id;

                    db.put(param, url.option, cb);
                });
            }
        } else if (verb === 'POST') {
            if (url.action) {
                Pouch('idb://' + url.database, function(err, db) {
                    if (err) throw(err);

                    var _id = url.action;
                    if (typeof param === 'string') {
                        param = JSON.parse(param);
                    }
                    if (typeof param !== 'object') { 
                        throw(new Error('PouchREST: PUT document expects JS object for document update'));
                    }

                    param._id = _id;

                    db.post(param, url.option, cb);
                }); 
            }
        } else if (verb === 'DELETE') {
            if (!url.action) {
                // delete database
                Pouch.destroy('idb://'+url.database, url.option, cb);
            } else {
                // delete a document
                Pouch('idb://' + url.database, function(err, db) {
                    if (err) throw(err);
                    db.remove(url.action, url.option, cb);
                });
            }
        }
    };

})(Pouch);