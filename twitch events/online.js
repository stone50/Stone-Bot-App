const setupEventHandlers = require('../tmi events/setupTmiEvents')
const { Client } = require('tmi.js')
const mongoose = require('mongoose')

const { sharedData, loadDatabase, setTwitchClient, botLog } = require('../api')

const handler = async () => {

    botLog('info', 'twitch online event triggered')

    botLog('info', 'initializing database connection event handlers')

    mongoose.connection.on('error', err => {
        throw `database connection failed: ${err}`
    })

    botLog('info', 'connecting to database')

    try {
        await mongoose.connect(process.env.DATABASE_CONNECT_STRING)
    } catch (err) {
        throw `database connection failed: ${err}`
    }

    await loadDatabase()

    setTwitchClient(new Client({
        identity: {
            username: process.env.BOT_USERNAME,
            password: process.env.TWITCH_OAUTH
        },
        channels: [process.env.TWITCH_CHANNEL]
    }))

    setupEventHandlers()

    botLog('info', 'connecting to twitch')

    sharedData.twitchClient.connect().catch(error => {
        botLog('warn', `twitch connection failed: ${error}`)
    })
}

module.exports = handler