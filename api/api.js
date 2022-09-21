const { sharedData } = require('./sharedData')
const { botLog } = require('./logs')
const { botModel } = require('./models')
const { loadTimers } = require('./timers')
const { loadCommands } = require('./commands')
const { loadFeedCount } = require('./feedCount')
const { loadQuotes } = require('./quotes')
const { loadMessages } = require('./messages')
const { loadGameRules } = require('./gameRules')

const loadBotDoc = async () => {
    botLog('info', 'loading bot document from database')
    sharedData.botDoc = await botModel.findOne()
    if (sharedData.botDoc === null) {
        throw `bot document fetch failed`
    }
    return sharedData.botDoc
}

const loadDatabase = async () => {
    botLog('info', 'loading data from database')
    await loadBotDoc()
    const timers = loadTimers()
    const commands = loadCommands()
    const feedCount = loadFeedCount()
    const quotes = loadQuotes()
    const messages = loadMessages()
    const gameRules = loadGameRules()
    await timers
    await commands
    await feedCount
    await quotes
    await messages
    await gameRules
    return sharedData.localDatabase
}

const setTwitchClient = (client) => {
    botLog('info', 'setting twitch client')
    sharedData.twitchClient = client
}

module.exports = {
    loadBotDoc,
    loadDatabase,
    setTwitchClient
}