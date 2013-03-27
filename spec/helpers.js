var helpers = {};

var async = helpers.async = function(functions, callback) {
    function series(functions) {
        callback = callback || function() {};

        if (!functions.length) {
            return callback();
        }

        var fn = functions.shift();
        fn.call(fn, function(err) {
            if (err) {
                callback(err);
                return;
            }

            series(functions);
        });
    }
    series(functions);
};

helpers.deleteAllPouches = function(callback) {
    Pouch.allDbs(function(err, dbs) {
        async(dbs.map(function(db) {
            return function(callback) {
                Pouch.destroy(db, callback);
            };
        }), callback);
    });
};

helpers.createPouches = function(arr, callback) {
    async(arr.map(function(name) {
        return function(callback) {
            new Pouch(name, callback);
        };
    }), callback);
};
