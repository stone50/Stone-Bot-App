const mongoose = require('mongoose')

const { clearSharedData, clearLogs, saveLogs, botLog } = require('../api')

const handler = async () => {

    botLog('info', 'twitch offline event triggered')

    if (saveLogs()) {
        clearLogs()
    }

    botLog('info', 'disconnecting from database')

    mongoose.disconnect()

    clearSharedData()
}

module.exports = handler