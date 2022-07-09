console.log('Initializing requires...')

//#region requires

require('dotenv/config')
const setupEventHandlers = require('./twitch events/handlers')
const { Client } = require('tmi.js')
const mongoose = require('mongoose')

const { sharedData, loadDatabase, setTwitchClient, addCommand } = require('./api')

//#endregion

console.log('Connecting to database...')

mongoose.connect(process.env.DATABASE_CONNECT_STRING, async () => {
    console.log('Loading data from database...')

    await loadDatabase()

    console.log('Initializing Twitch Client...')

    setTwitchClient(new Client({
        options: { debug: true, messagesLogLevel: "info" },
        connection: {
            reconnect: true,
            secure: true
        },
        identity: {
            username: process.env.BOT_USERNAME,
            password: process.env.TWITCH_OAUTH
        },
        channels: [process.env.TWITCH_CHANNEL]
    }))

    console.log('Initializing Twitch event handlers...')

    setupEventHandlers()

    sharedData.twitchClient.connect().catch(console.error)
})