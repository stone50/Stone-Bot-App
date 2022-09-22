const mongoose = require('mongoose')

const { clearSharedData, sharedData } = require('../api/sharedData')
const { clearLogs, saveLogs, botLog } = require('../api/logs')
const { clearGameRulesFromFile } = require('../api/gameRules')

const handler = async () => {

    botLog('info', 'twitch offline event triggered')

    sharedData.twitchClient.say(sharedData.twitchClient.channels[0], 'I must depart! Until next time, PEACE MercyWing1 :) MercyWing2')

    botLog('info', 'removing timers')

    Object.keys(sharedData.localDatabase.timers).forEach(timerKeyword => {
        sharedData.localDatabase.timers[timerKeyword].destroy()
    })

    if (sharedData.twitchClient) {
        botLog('info', 'disconnecting from twitch')
        sharedData.twitchClient.disconnect()
    }

    if (mongoose.connection.readyState === 1) {
        if (await saveLogs()) {
            clearLogs()
        } else {
            botLog('warn', 'unable to save logs to database')
        }

        botLog('info', 'disconnecting from database')
        mongoose.disconnect()
    }

    clearGameRulesFromFile()

    clearSharedData()
}

module.exports = handler