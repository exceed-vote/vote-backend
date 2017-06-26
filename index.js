const express = require('express')
const bodyParser = require('body-parser')
const resTime = require('response-time')
const morgan = require('morgan')
const compression = require('compression')
const util = require('util')
const app = express()
const db = require('./src/db')

var utf8 = require('utf8')

app.use(express.static('public'))
app.use(bodyParser.json())
morgan(':method :url :status :res[content-length] - :response-time ms')
app.use(resTime())
app.use(compression())

app.get('/user', (req, res) => {
    db.user().then(function(resolve) {
        var name = resolve[0].name
        console.log(name);
        res.status(200).json(resolve)
    }).catch(function (rej) {
        console.error(rej)
    })
})

app.post('/insert', (req, res) => {
    // code
    // name
    // description
    // picture
    var data = req.body
    db.insert(data).then(function(resolve) {
        res.status(201).end(JSON.stringify(resolve))
    }).catch(function (rej) {
        res.status(500).end(JSON.stringify(rej))
    })
})

// test post with body
app.post('/test', (req, res) => {
    res.status(200).json(req.body)
})

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080')
})
