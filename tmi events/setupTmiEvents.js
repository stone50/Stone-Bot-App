const { sharedData } = require('../api/sharedData')
const { botLog } = require('../api/logs')

const createEvent = eventName => {
    botLog('info', `creating ${eventName} tmi event`)
    sharedData.twitchClient.on(eventName, require(`./${eventName}`))
}

const setupEvents = () => {
    botLog('info', 'creating tmi events')
    createEvent('hosted')
    createEvent('join')
    createEvent('message')
    createEvent('raided')
}

module.exports = setupEvents