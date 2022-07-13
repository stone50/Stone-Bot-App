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

const start = async () => {

    setupTwitchEvents()

    app.post('/eventsub', twitchEventHandler)

    app.listen(process.env.SERVER_PORT)

}

start()