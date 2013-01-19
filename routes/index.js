exports.index = function(req, res){
    require('fs').readFile(__dirname + '/../public/index.html', function(err, file) {
        res.write(file);
        res.end();
    });
};