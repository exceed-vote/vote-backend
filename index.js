const express = require('express')
const bodyParser = require('body-parser')
const resTime = require('response-time')
const morgan = require('morgan')
const compression = require('compression')
const util = require('util')
const app = express()
const db = require('./src/db')
const auth = require('./src/auth')

var utf8 = require('utf8')

app.use(express.static('public'))
app.use(bodyParser.json())
morgan(':method :url :status :res[content-length] - :response-time ms')
app.use(resTime())
app.use(compression())

app.get('/group/:code', (req, res) => {
    db.group(req.params.code).then(function(result) {
        console.info("request group information code=" + req.params.code);
        res.status(200).json(result)
    }).catch(function(rej) {
        console.error(rej)
        res.status(500).json(rej)
    })
})

app.get('/group', (req, res) => {
    db.group().then(function(result) {
        console.info("request group information all");
        res.status(200).json(result)
    }).catch(function(rej) {
        console.error(rej)
        res.status(500).json(rej)
    })
})

app.post('/insert', (req, res) => {
    // code
    // name
    // description
    // picture
    var data = req.body
    if (!data || !data.code || data === "") res.status(401).json({
        message: "body not exist"
    })

    db.insert(data).then(function(resolve) {
        console.info("complete insertion")
        res.status(201).json(resolve)
    }).catch(function(rej) {
        var code = rej.code
        if (code == 1062)
            res.status(400).json({
                message: "Duplicate entry '%s' for key %d"
            })
        else
            res.status(500).json(rej)
    })
})

// test post with body
// app.post('/test', (req, res) => {
//    res.status(200).json(req.body)
// })

app.post('/login', (req, res) => {
    db.auth(req.body).then((result) => {
        let num = Number.parseInt(result.info.numRows)
        if (num !== 1) {
            res.status(400).json({
                message: "The student id or name is not exist!"
            })
        } else {
            let information = result[0]
            delete information.vote_soft
            delete information.vote_hard
            delete information.vote_popular
            auth.login(information).then((result) => {
                res.status(201).json({
                    token: result
                })
            }).catch((err) => {
                res.status(500).json({
                    message: err
                })
            })
        }
    }).catch((err) => {
        res.status(500).json({
            message: err
        })
    })
})

app.get('/verify/:token', (req, res) => {
    auth.verify(req.params.token).then((result) => {
        res.status(200).json({
            successful: true,
            student_id: result.student_id
        })
    }).catch((err) => {
        res.status(401).json({
            successful: false,
            name: err.name,
            message: err.message
        })
    })
})

app.post('/vote', (req, res) => {
    if (!req.body.token) res.status(400).json({
        successful: false,
        message: "token not exist, Authorize"
    })
    else
    // verify
        auth.verify(req.body.token).then((result) => {
        return db.vote(result.student_id, result.name, req.body.pop, req.body.soft, req.body.hard)
            // vote
    }).then((result) => {
        res.status(200).json({
            successful: true,
            id: result.info.insertId
        })
    }).catch((err) => {
        if (err.code) {
            if (err.code === 1452) {
                res.status(400).json({
                    successful: false,
                    message: "group number not exist!"
                })
            } else res.status(500).json({
                successful: false,
                message: err
            })
        } else {
            res.status(401).json({
                successful: false,
                message: err
            })
        }
    })
})

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080')
})
