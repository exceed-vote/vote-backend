const config = require('../db_config')
const Client = require('mariasql')
const utf8 = require('utf8')

run = (query) => {
    let cli = new Client(config)
    return new Promise((res, rej) => {
        cli.query(query, (err, rows) => {
            if (err) return rej(err)
            else return res(rows)
        })
    })
}

exports.group = (code) => {
    let where = ";"
    if (code) where = ` WHERE code=${code};`
    let query = 'SELECT id,code,name,short_description,REPLACE(TO_BASE64(informations.picture), CHAR(10), "") AS picture FROM exceed_project.informations ' + where
    return run(query).then((result) => {
        return new Promise((res, rej) => {
            result.forEach((val, i) => {
                result[i].name = utf8.decode(result[i].name)
                result[i].short_description = utf8.decode(result[i].short_description)
            })
            if (result.length < 1) rej("group " + code + " not found, or no group in database")
            return res(result)
        })
    })
}

exports.insert = (json) => {
    let query = `INSERT INTO exceed_project.informations (code,name,short_description,picture) VALUE (${json.code}, "${json.name}", "${json.description}", "${json.picture}")`
    return run(query)
}

exports.auth = (json) => {
    let query = `SELECT * FROM exceed_project.users WHERE student_id='${json.id}' AND name='${json.name}'`
    return run(query)
}

exports.vote = (student_id, name, group_pop, group_soft, group_hard) => {
    return new Promise((res, rej) => {
        this.auth({
            id: student_id,
            name: name
        }).then((result) => {
            if (result.length !== 1) rej({
                message: "user must have only 1 account!"
            })
            result = result[0]
            if (!result.vote_popular && !result.vote_hard && !result.vote_soft) {
                let query = `UPDATE exceed_project.users SET 
                                 vote_popular=${group_pop},
                                 vote_hard=${group_hard},
                                 vote_soft=${group_soft}
                             WHERE student_id='${result.student_id}' AND name='${result.name}'`
                console.log(query)
                return run(query)
            } else {
                return rej({
                    message: "you already voted."
                })
            }
        }).catch((err) => {
            return rej(err)
        })
    })
}

