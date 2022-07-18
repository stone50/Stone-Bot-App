require('dotenv').config()
const express = require('express')
const app = express()

const setupTwitchEvents = require('./twitch events/setupTwitchEvents')
const twitchEventHandler = require('./twitch events/twitchEventHandler')
const { botLog, clearLogs } = require('./api')

const offlineHandler = require('./twitch events/offline')

let server = null

const start = async () => {

    botLog('info', 'starting Stone Bot')

    await setupTwitchEvents()

    botLog('info', 'setting up twitch event subscription endpoint')

    app.post('/eventsub', twitchEventHandler)

    botLog('info', 'starting server')

    server = app.listen(process.env.SERVER_PORT)
}

start().catch(err => {
    botLog('error', err)
    try {
        offlineHandler()
    } catch (error) {
        botLog('error', error)
    }
    botLog('info', 'closing server')
    if (!server) {
        botLog('info', 'no server to close')
    } else {
        server.close()
    }
})