const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(express.static('public'))

// app.use(bodyParser.json())

app.post('/createUser', (req, res) => {
    console.log("creating user")
    res.sendStatus(200)
})
app.listen(8080, () => {
    console.log('Server running on http://localhost:8080')
})
