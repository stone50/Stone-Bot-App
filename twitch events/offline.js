const mongoose = require('mongoose')

const { clearSharedData, clearLogs, saveLogs, botLog, sharedData } = require('../api')

const handler = async () => {

    botLog('info', 'twitch offline event triggered')

    botLog('info', 'removing timers')

    Object.keys(sharedData.localDatabase.timers).forEach(timerKeyword => {
        sharedData.localDatabase.timers[timerKeyword].destroy()
    })

    if (sharedData.twitchClient) {
        botLog('info', 'disconnecting from twitch')
        sharedData.twitchClient.disconnect()
    }

    if (mongoose.connection.readyState == 1 && await saveLogs()) {
        clearLogs()
    }

    if (mongoose.connection.readyState == 1) {
        botLog('info', 'disconnecting from database')
        mongoose.disconnect()
    }

    clearSharedData()
}

module.exports = handler