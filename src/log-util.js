const log4js = require('log4js')

get = (student_id, ip) => {
    const config = {
        appenders: [
            {
                type: "file",
                filename: "logs/common.log",
                category: "common",
                maxLogSize: 2097152
            },
            {
                type: "dateFile",
                filename: "logs/history.log",
                pattern: "-dd--hh.log",
                alwaysincludepattern: true,
                category: "history",
                layout: {
                    type: "pattern",
                    pattern: "%[[%d]%] %[[%p]%] [%x{student_id}] [%x{ip}] - %c - %m%n",
                    tokens: {
                        student_id: () => {
                            return student_id
                        },
                        ip: () => {
                            return ip
                        }
                    }
                }  
            },
            {
                "type": "file",
                "filename": "logs/error.err",
                "category": "error",
                "maxLogSize": 2097152
            }
        ]
    }
    log4js.configure(config)
    return log4js
}

exports.logger = (type, student_id, ip) => {
    return get(student_id, ip).getLogger(type)
}
