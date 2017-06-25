const config = require('../db_config');
const Client = require('mariasql');

var cli = new Client(config);

cli.query('SHOW DATABASES', function(err, rows) {
  if (err)
    throw err;
  console.dir(rows);
});

cli.end();
