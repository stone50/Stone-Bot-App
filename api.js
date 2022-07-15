//#region requires

const { model, Schema } = require('mongoose')
const fs = require('fs')

const Timer = require('./components/timer')
const Command = require('./components/command')
const Message = require('./components/message')

//#endregion

const sharedData = {
    logger: null,
    twitchClient: null,
    permissionHierarchy: [
        'viewer',
        'sub',
        'mod',
        'streamer'
    ],
    botDoc: null,
    localDatabase: {
        timers: {},
        commands: {},
        feedCount: 0,
        quotes: [],
        messages: {},
        chessTips: [],
        kansasFacts: [],
        crabFacts: []
    }
}

//#region schemas and models

const timerSchema = new Schema({
    keyword: String,
    delay: Number,
    enabled: Boolean
})

const commandSchema = new Schema({
    keyword: String,
    permission: String,
    enabled: Boolean
})

const messageSchema = new Schema({
    keyword: String,
    regexStr: String,
    enabled: Boolean
})

const botModel = model('stone-bot-profiles', new Schema({
    timers: {
        type: Object,
        of: timerSchema
    },
    commands: {
        type: Object,
        of: commandSchema
    },
    feedCount: Number,
    quotes: [String],
    messages: {
        type: Object,
        of: messageSchema
    },
    chessTips: [String],
    kansasFacts: [String],
    crabFacts: [String]
}))

const logModel = model('logs', new Schema({
    timestamp: Date,
    level: String,
    message: String
}))

//#endregion

//#region load sharedData

const loadBotDoc = async () => {
    botLog('info', 'loading bot document from database')
    sharedData.botDoc = await botModel.findOne()
    if (sharedData.botDoc === null) {
        throw `bot document fetch failed`
    }
    return sharedData.botDoc
}

const loadTimers = async () => {
    botLog('info', 'loading timers from bot document')
    sharedData.localDatabase.timers = {}
    Object.keys(sharedData.botDoc.timers).forEach(timerKeyword => {
        const botDocTimer = sharedData.botDoc.timers[timerKeyword]
        sharedData.localDatabase.timers[timerKeyword] = new Timer(
            timerKeyword,
            require(`./timers/${timerKeyword}`),
            botDocTimer.delay,
            botDocTimer.enabled
        )
    })
    return sharedData.localDatabase.timers
}

const loadCommands = async () => {
    botLog('info', 'loading commands from bot document')
    sharedData.localDatabase.commands = {}
    Object.keys(sharedData.botDoc.commands).forEach(commandKeyword => {
        const botDocCommand = sharedData.botDoc.commands[commandKeyword]
        sharedData.localDatabase.commands[commandKeyword] = new Command(
            commandKeyword,
            require(`./commands/${commandKeyword}`),
            sharedData.permissionHierarchy.indexOf(botDocCommand.permission),
            botDocCommand.enabled
        )
    })
    return sharedData.localDatabase.commands
}

const loadFeedCount = async () => {
    botLog('info', 'loading feed count from bot document')
    sharedData.localDatabase.feedCount = sharedData.botDoc.feedCount
    return sharedData.localDatabase.feedCount
}

const loadQuotes = async () => {
    botLog('info', 'loading quotes from bot document')
    sharedData.localDatabase.quotes = sharedData.botDoc.quotes
    return sharedData.localDatabase.quotes
}

const loadMessages = async () => {
    botLog('info', 'loading messages from bot document')
    sharedData.localDatabase.messages = {}
    Object.keys(sharedData.botDoc.messages).forEach(messageKeyword => {
        const botDocMessage = sharedData.botDoc.messages[messageKeyword]
        sharedData.localDatabase.messages[messageKeyword] = new Message(
            messageKeyword,
            botDocMessage.regexStr,
            require(`./messages/${messageKeyword}`),
            botDocMessage.enabled
        )
    })
    return sharedData.localDatabase.messages
}

const loadChessTips = async () => {
    botLog('info', 'loading chess tips from bot document')
    sharedData.localDatabase.chessTips = sharedData.botDoc.chessTips
    return sharedData.localDatabase.chessTips
}

const loadKansasFacts = async () => {
    botLog('info', 'loading kansas facts from bot document')
    sharedData.localDatabase.kansasFacts = sharedData.botDoc.kansasFacts
    return sharedData.localDatabase.kansasFacts
}

const loadCrabFacts = async () => {
    botLog('info', 'loading crab facts from bot document')
    sharedData.localDatabase.crabFacts = sharedData.botDoc.crabFacts
    return sharedData.localDatabase.chesscrabFactsTips
}

const loadDatabase = async () => {
    botLog('info', 'loading data from database')
    await loadBotDoc()
    const timers = loadTimers()
    const commands = loadCommands()
    const feedCount = loadFeedCount()
    const quotes = loadQuotes()
    const messages = loadMessages()
    const chessTips = loadChessTips()
    const kansasFacts = loadKansasFacts()
    const crabFacts = loadCrabFacts()
    await timers
    await commands
    await feedCount
    await quotes
    await messages
    await chessTips
    await kansasFacts
    await crabFacts
    return sharedData.localDatabase
}

//#endregion

//#region save sharedData

const saveTimers = async () => {
    botLog('info', 'saving timers to database')
    sharedData.botDoc.timers = {}
    Object.keys(sharedData.localDatabase.timers).forEach(timerKeyword => {
        const localDatabaseTimer = sharedData.localDatabase.timers[timerKeyword]
        sharedData.botDoc.timers[timerKeyword] = {
            keyword: timerKeyword,
            delay: localDatabaseTimer.delay,
            enabled: localDatabaseTimer.getEnabled()
        }
    })

    await sharedData.botDoc.save()

    return sharedData.botDoc.timers
}

const saveCommands = async () => {
    botLog('info', 'saving commands to database')
    sharedData.botDoc.commands = {}
    Object.keys(sharedData.localDatabase.commands).forEach(commandKeyword => {
        const localDatabaseCommand = sharedData.localDatabase.commands[commandKeyword]
        sharedData.botDoc.commands[commandKeyword] = {
            keyword: commandKeyword,
            permission: sharedData.permissionHierarchy[localDatabaseCommand.permission],
            enabled: localDatabaseCommand.enabled
        }
    })

    await sharedData.botDoc.save()

    return sharedData.botDoc.commands
}

const saveFeedCount = async () => {
    botLog('info', 'saving feed count to database')
    sharedData.botDoc.feedCount = sharedData.localDatabase.feedCount

    await sharedData.botDoc.save()

    return sharedData.botDoc.feedCount
}

const saveQuotes = async () => {
    botLog('info', 'saving quotes to database')
    sharedData.botDoc.quotes = sharedData.localDatabase.quotes

    await sharedData.botDoc.save()

    return sharedData.botDoc.quotes
}

const saveMessages = async () => {
    botLog('info', 'saving messages to database')
    sharedData.botDoc.messages = {}
    Object.keys(sharedData.localDatabase.messages).forEach(messageKeyword => {
        const localDatabaseMessage = sharedData.localDatabase.messages[messageKeyword]
        sharedData.botDoc.messages[messageKeyword] = {
            keyword: messageKeyword,
            regexStr: localDatabaseMessage.regexStr,
            enabled: localDatabaseMessage.enabled
        }
    })

    await sharedData.botDoc.save()

    return sharedData.botDoc.messages
}

const saveLogs = async () => {
    botLog('info', 'saving logs to database')
    for (const fileLine of fs.readFileSync('./logs.log', 'utf8').split('\r\n')) {
        if (fileLine) {
            const attributes = fileLine.match(/\[(.*)] (.*): (.*)/)
            await new logModel({
                timestamp: new Date(attributes[1]),
                level: attributes[2],
                message: attributes[3]
            }).save()
        }
    }
    return true
}

//#endregion

//#region CRUD operations

const clearSharedData = () => {
    botLog('info', 'clearing shared data')
    sharedData.twitchClient = null
    sharedData.permissionHierarchy = [
        'viewer',
        'sub',
        'mod',
        'streamer'
    ]
    sharedData.botDoc = null
    sharedData.localDatabase = {
        timers: {},
        commands: {},
        feedCount: 0,
        quotes: [],
        messages: {},
        chessTips: [],
        kansasFacts: [],
        crabFacts: []
    }
}

const setTwitchClient = (client) => {
    botLog('info', 'setting twitch client')
    sharedData.twitchClient = client
}

const setTimerEnable = async (keyword, enable, awaitSave = false) => {
    botLog('info', `${enable ? 'enabling' : 'disabling'} ${keyword} timer`)
    const timer = sharedData.localDatabase.timers[keyword]
    timer.setEnabled(enable)
    awaitSave ? await saveTimers() : saveTimers()
    return timer
}

const setCommandEnable = async (keyword, enable, awaitSave = false) => {
    botLog('info', `${enable ? 'enabling' : 'disabling'} ${keyword} command`)
    const command = sharedData.localDatabase.commands[keyword]
    command.enabled = enable
    awaitSave ? await saveCommands() : saveCommands()
    return command
}

const incrementFeedCount = async (awaitSave = false) => {
    botLog('info', 'incrementing feed count')
    sharedData.localDatabase.feedCount++
    awaitSave ? await saveFeedCount() : saveFeedCount()
    return sharedData.localDatabase.feedCount
}

const addQuote = async (quote, awaitSave = false) => {
    botLog('info', `adding quote ${quote}`)
    sharedData.localDatabase.quotes.push(quote)
    awaitSave ? await saveQuotes() : saveQuotes()
    return sharedData.localDatabase.quotes
}

const editQuote = async (quoteIndex, newQuote, awaitSave = false) => {
    botLog('info', `editing quote ${quoteIndex} to say "${newQuote}"`)
    sharedData.localDatabase.quotes[quoteIndex] = newQuote
    awaitSave ? await saveQuotes() : saveQuotes()
    return sharedData.localDatabase.quotes
}

const deleteQuote = async (quoteIndex, awaitSave = false) => {
    botLog('info', `deleting quote ${quoteIndex}`)
    sharedData.localDatabase.quotes.splice(quoteIndex, 1)
    awaitSave ? await saveQuotes() : saveQuotes()
    return sharedData.localDatabase.quotes
}

const setMessageEnable = async (keyword, enable, awaitSave = false) => {
    botLog('info', `${enable ? 'enabling' : 'disabling'} ${keyword} message`)
    const message = sharedData.localDatabase.messages[keyword]
    message.enabled = enable
    awaitSave ? await saveMessages() : saveMessages()
    return message
}

const clearLogs = () => {
    botLog('info', 'clearing logs from local file')
    fs.truncateSync('./logs.log', 0)
}

//#endregion

const botLog = (level, message) => {
    fs.appendFileSync(`./logs.log`, `[${new Date().toISOString()}] ${level.toUpperCase()}: ${message}\r\n`)
}

module.exports = {
    sharedData,
    saveLogs,
    clearSharedData,
    loadDatabase,
    setTwitchClient,
    setTimerEnable,
    setCommandEnable,
    incrementFeedCount,
    addQuote,
    editQuote,
    deleteQuote,
    setMessageEnable,
    clearLogs,
    botLog
}