const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const db = require('./src/db')

app.use(express.static('public'))

// app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json(db);
    res.sendStatus(200)
})

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080')
})
