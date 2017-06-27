const config = require('../db_config')
const Client = require('mariasql')
const utf8 = require('utf8')
const Buffer = require('buffer').Buffer

exports.show = function() {
    var cli = new Client(config)
    return new Promise((res, rej) => {
        cli.query('SHOW DATABASES', function(err, rows) {
            if (err)
                return rej(err)
            return res(rows)
        })
    })
}

exports.group = function(code) {
    var cli = new Client(config)
    return new Promise((res, rej) => {
        if (!code || code === "")
            return rej("code cannot be null or empty")

        cli.query('SELECT * FROM exceed_project.informations ' + `WHERE code=${code}`, function(err, rows) {
            if (err)
                return rej(err)
            rows.forEach(function (val, i) {
                rows[i].name = utf8.decode(rows[i].name)
                rows[i].short_description = utf8.decode(rows[i].short_description)
                // rows[i].picture = new Buffer(rows[i].picture).toString('base64')
            })
            if (rows.length > 1) rej("code cannot be same!")
            return res(rows[0])
        })
    })
}

exports.insert = function(json) {
    var cli = new Client(config)
    return new Promise((res, rej) => {
        var query = `INSERT INTO exceed_project.informations (code,name,short_description,picture) VALUE (${json.code}, "${json.name}", "${json.description}", "${json.picture}")`
        // console.log(query)
        cli.query(query, function(err, rows) {
            if (err)
                return rej(err)
            return res(rows)
        })
    })
}

