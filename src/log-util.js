exports.get = () => {
    const log4js = require('log4js')
    log4js.configure('./config/log_config.json')
    return log4js
}
