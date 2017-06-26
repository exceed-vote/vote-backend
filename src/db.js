const config = require('../db_config')
const Client = require('mariasql')
const utf8 = require('utf8')

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

exports.user = function(id) {
    var cli = new Client(config)
    return new Promise((res, rej) => {
        var where = ""
        if (id)
            where = `WHERE id=${id}`
        cli.query('SELECT * FROM exceed_project.informations ' + where, function(err, rows) {
            if (err)
                return rej(err)
            rows.forEach(function (val, i) {
                rows[i].name = utf8.decode(rows[i].name)
                rows[i].short_description = utf8.decode(rows[i].short_description)
            })
            return res(rows)
        })
    })
}

exports.insert = function(json) {
    var code = json.code
    var name = json.name
    var des = json.description
    var pic = json.picture
    var cli = new Client(config)
    return new Promise((res, rej) => {
        var query = `INSERT INTO exceed_project.informations (code,name,short_description,picture) VALUE (${code}, "${name}", "${des}", "${pic}")`
        console.log(query)
        cli.query(query, function(err, rows) {
            if (err)
                return rej(err)
            return res(rows)
        })
    })
}
