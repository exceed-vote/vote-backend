const jwt = require('jsonwebtoken')
const private_key = "secret_key"

// config.name: string
// config.teacher: boolean
//   optional: config.id: string (if not teacher)
// expire in 24 hour
exports.login = (config) => {
    return new Promise((res, rej) => {
        jwt.sign(config, private_key, { 
            algorithm: 'HS512',
            expiresIn: '1d'
        }, function(err, token) {
            if (err) return rej(err)
            return res(token)
        })
    })
}

exports.get = (token) => {
    return new Promise((res, rej) => {
        var decode = jwt.decode(token, { complete: true })
        delete decode.signature
        return res(decode)
    })
}

exports.verify = (token) => {
    return new Promise((res, rej) => {
        jwt.verify(token, private_key, function(err, decoded) {
            if (err) return rej(err)
            return res(decoded)
        })
    })
}
