Pouch('idb://test', function(err, db) {
   init(db);
});


function init(db) {
    db.allDocs(function(err, response) {
        if (err) {
            throw err;
        }
        if (response.total_rows === 0) {
            // not bootstrapped
            db.bulkDocs({
                docs: [

                    {
                        "item": "apple",
                        "prices": {
                            "Fresh Mart": 1.59,
                            "Price Max": 5.99,
                            "Apples Express": 0.79
                        }
                    },

                    {
                       "item": "orange",
                       "prices": {
                           "Fresh Mart": 1.99,
                           "Price Max": 3.19,
                           "Citrus Circus": 1.09
                       }
                    },

                    {
                       "item": "banana",
                       "prices": {
                           "Fresh Mart": 1.99,
                           "Price Max": 0.79,
                           "Banana Montana": 4.22
                       }
                    }

                ]

            }, function(err, res) {
                if (err) throw(err);
                alert('db idb://test set up');
            });
        }
    });
}

alert('wtf');