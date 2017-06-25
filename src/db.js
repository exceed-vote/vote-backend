const config = require('../db_config');
const Client = require('mariasql');

var cli = new Client(config);

exports.show = function() {
    cli.query('SHOW DATABASES', function(err, rows) {
        if (err)
            throw err;
        return rows;
    });
    cli.end();
}

