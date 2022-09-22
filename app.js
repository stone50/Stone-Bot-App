require('dotenv').config()
const nodeCleanup = require('node-cleanup')

const { botLog } = require('./api/logs')

const onlineHandler = require('./twitch events/online')
const offlineHandler = require('./twitch events/offline')

const exitHandler = async (exitCode, signal) => {
    botLog('info', `exiting with exit code: ${exitCode} and signal: ${signal}`)
    await offlineHandler().catch((err) => {
        botLog('error', err)
    })
    process.exit(process.pid, signal)
}

nodeCleanup((exitCode, signal) => {
    exitHandler(exitCode, signal)
    nodeCleanup.uninstall()
    return false
})

const start = async () => {

    botLog('info', 'starting Stone Bot')

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
    | Stone Bot v4.0.0                   |
    ======================================
    Press Ctrl + C anytime to close
    `)

    onlineHandler().catch((err) => {
        botLog('error', err)
        process.exit()
    })
}

start()