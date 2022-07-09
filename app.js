console.log('Initializing requires...')

//#region requires

const dotenv = require('dotenv').config({
    path: `${__dirname}/.env`
})
if (dotenv.error) {
    throw dotenv.error;
}

const setupEventHandlers = require('./twitch events/handlers')
const { Client } = require('tmi.js')
const mongoose = require('mongoose')

const { sharedData, loadDatabase, setTwitchClient } = require('./api')

//#endregion

const start = async () => {
    console.log(`
    ======================================
    |        --------------------        |
    |      /                      \\      |
    |      |     _          _     |      |
    |     /|    / \\        / \\    |\\     |
    |    | |    \\_/        \\_/    | |    |
    |     \\|                      |/     |
    |      |                      |      |
    |      |      \\________/      |      |
    |      |                      |      |
    |      \\______________________/      |
    |                                    |
    | Stone Bot v1.0.0                   |
    ======================================

    Press Ctrl + C anytime to close

    `)

    try {

        console.log('Initializing database connection event handlers...')

        mongoose.connection.on('error', err => {
            console.error(err);
        })

        console.log('Connecting to database...')

        await mongoose.connect(process.env.DATABASE_CONNECT_STRING)

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

    } catch (error) {
        console.log(error);
    }
}

start()