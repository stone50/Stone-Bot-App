const dotenv = require('dotenv').config({
    path: `${__dirname}/.env`
})
if (dotenv.error) {
    throw dotenv.error
}

const express = require('express')
const app = express()

const setupTwitchEvents = require('./twitch events/setupTwitchEvents')
const twitchEventHandler = require('./twitch events/twitchEventHandler')
const { botLog, clearLogs } = require('./api')

const start = async () => {

    clearLogs() // testing

    botLog('info', 'starting Stone Bot')

    await setupTwitchEvents()

    botLog('info', 'setting up twitch event subscription endpoint')

    app.post('/eventsub', twitchEventHandler)

    botLog('info', 'starting server')

    app.listen(process.env.SERVER_PORT)

    /* testing
        call online twitch event handler
        wait a few seconds
        call offline twitch event handler

        check if sharedData is cleared
        check if timers still go off
        check if tmi event handlers still trigger
    */

}

start().catch(err => {
    botLog('error', err)
})