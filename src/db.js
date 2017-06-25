const config = require('../db_config');
const Client = require('mariasql');

exports.show = function() {
    var cli = new Client(config);
    return new Promise((res, rej) => {
        cli.query('SHOW DATABASES', function(err, rows) {
            if (err)
                return rej(err);
            return res(rows);
        });
    });
}

