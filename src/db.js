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
            if (result.length < 1) return rej("group " + code + " not found, or no group in database")
            return res(result)
        })
    })
}

exports.insert = (json) => {
    let query1 = `INSERT INTO exceed_project.informations (code,name,short_description,picture) VALUE (${json.code}, "${json.name}", "${json.description}", "${json.picture}")`
    return run(query1).then((result1) => {
        let query2 = `INSERT INTO exceed_project.information_vote (information_id) VALUE (${result1.info.insertId})`
        return run(query2).then((result2) => {
            return new Promise((res, rej) => {
                res({
                    informations: {
                        id: result1.info.insertId
                    },
                    information_vote: {
                        id: result2.info.insertId
                    }
                })
            })
        })
    })
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
            if (result.length !== 1) rej("User must have only 1 account!")
            result = result[0]
            if (group_pop === group_soft || group_pop === group_hard || group_hard === group_soft) rej("All vote group number must be different.")
            if (!result.vote_popular && !result.vote_hard && !result.vote_soft) {
                let query = `UPDATE exceed_project.users SET 
                                 vote_popular=${group_pop},
                                 vote_hard=${group_hard},
                                 vote_soft=${group_soft}
                             WHERE student_id='${result.student_id}' AND name='${result.name}';
                             UPDATE exceed_project.information_vote SET
                                 popular_score = popular_score + 1
                             WHERE information_code=${group_pop};
                             UPDATE exceed_project.information_vote SET
                                 soft_score = soft_score + 1
                             WHERE information_code=${group_soft};
                             UPDATE exceed_project.information_vote SET
                                 hard_score = hard_score + 1
                             WHERE information_code=${group_hard};
                             `
                run(query).then((re) => {
                    return res(re)
                }).catch((err) => {
                    return rej(err)
                })
            } else {
                return rej("you already voted.")
            }
        }).catch((err) => {
            return rej(err)
        })
    })
}
