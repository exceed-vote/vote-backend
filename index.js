const express = require('express')
const bodyParser = require('body-parser')
const resTime = require('response-time')
const morgan = require('morgan')
const compression = require('compression')
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
        // var name = resolve[0].name
        res.status(200).json(resolve);
    }).catch(function (rej) {
        console.error(rej)
    })
})

app.get('/insert', (req, res) => {
    var data = {
        code: 2,
        name: "ทำไม",
        description: "ไม่มี",
        picture: "asdf"
    };
    db.insert(data).then(function(resolve) {
        console.log(resolve);
    }).catch(function (rej) {
        console.error(rej);
    });
});

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080')
})
