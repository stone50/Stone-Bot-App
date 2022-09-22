const fs = require('fs')

const { logModel } = require('./models')

const logFilePath = './logs.log'

const saveLogs = async () => {
    botLog('info', 'saving logs to database')
    for (const fileLine of fs.readFileSync(logFilePath, 'utf8').split('\r\n')) {
        if (fileLine) {
            const attributes = fileLine.match(/\[(.*?)] (.*?): (.*)/)
            await new logModel({
                timestamp: new Date(attributes[1]),
                level: attributes[2],
                message: attributes[3]
            }).save()
        }
    }
    return true
}

const clearLogs = () => {
    botLog('info', 'clearing logs from local file')
    fs.truncateSync(logFilePath, 0)
}

const botLog = (level, message) => {
    const logMessage = `[${new Date().toISOString()}] ${level.toUpperCase()}: ${message}`
    fs.appendFileSync(logFilePath, `${logMessage}\r\n`)
    console.log(logMessage)
}

module.exports = {
    logFilePath,
    saveLogs,
    clearLogs,
    botLog
}