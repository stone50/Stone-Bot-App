//#region requires

const { model, Schema } = require('mongoose')

const Timer = require('./timer')
const Command = require('./command')
const Message = require('./message')

//#endregion

const sharedData = {
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
        messages: {}
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
    responses: [String],
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
    }
}))

//#endregion

//#region load sharedData

const loadBotDoc = async () => {
    sharedData.botDoc = await botModel.findOne()
    return sharedData.botDoc
}

const loadTimers = async () => {
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
    sharedData.localDatabase.feedCount = sharedData.botDoc.feedCount
    return sharedData.localDatabase.feedCount
}

const loadQuotes = async () => {
    sharedData.localDatabase.quotes = sharedData.botDoc.quotes
    return sharedData.localDatabase.quotes
}

const loadMessages = async () => {
    sharedData.localDatabase.messages = {}
    Object.keys(sharedData.botDoc.messages).forEach(messageKeyword => {
        const botDocMessage = sharedData.botDoc.messages[messageKeyword]
        sharedData.localDatabase.messages[messageKeyword] = new Message(
            messageKeyword,
            botDocMessage.regexStr,
            botDocMessage.responses,
            botDocMessage.enabled
        )
    })
    return sharedData.localDatabase.messages
}

const loadDatabase = async () => {
    await loadBotDoc()
    loadTimers()
    loadCommands()
    loadFeedCount()
    loadQuotes()
    loadMessages()
    return sharedData.localDatabase
}

//#endregion

//#region save sharedData

const saveTimers = async (saveToDatabase = true) => {
    sharedData.botDoc.timers = {}
    Object.keys(sharedData.localDatabase.timers).forEach(timerKeyword => {
        const localDatabaseTimer = sharedData.localDatabase.timers[timerKeyword]
        sharedData.botDoc.timers[timerKeyword] = {
            keyword: timerKeyword,
            delay: localDatabaseTimer.delay,
            enabled: localDatabaseTimer.enabled
        }
    })

    if (saveToDatabase) {
        sharedData.botDoc.save()
    }

    return sharedData.botDoc.timers
}

const saveCommands = async (saveToDatabase = true) => {
    sharedData.botDoc.commands = {}
    Object.keys(sharedData.localDatabase.commands).forEach(commandKeyword => {
        const localDatabaseCommand = sharedData.localDatabase.commands[commandKeyword]
        sharedData.botDoc.commands[commandKeyword] = {
            keyword: commandKeyword,
            permission: sharedData.permissionHierarchy[localDatabaseCommand.permission],
            enabled: localDatabaseCommand.enabled
        }
    })

    if (saveToDatabase) {
        sharedData.botDoc.save()
    }

    return sharedData.botDoc.commands
}

const saveFeedCount = async (saveToDatabase = true) => {
    sharedData.botDoc.feedCount = sharedData.localDatabase.feedCount

    if (saveToDatabase) {
        sharedData.botDoc.save()
    }

    return sharedData.botDoc.feedCount
}

const saveQuotes = async (saveToDatabase = true) => {
    sharedData.botDoc.quotes = sharedData.localDatabase.quotes

    if (saveToDatabase) {
        sharedData.botDoc.save()
    }

    return sharedData.botDoc.quotes
}

const saveMessages = async (saveToDatabase = true) => {
    sharedData.botDoc.messages = {}
    Object.keys(sharedData.localDatabase.messages).forEach(messageKeyword => {
        const localDatabaseMessage = sharedData.localDatabase.messages[messageKeyword]
        sharedData.botDoc.messages[messageKeyword] = {
            keyword: messageKeyword,
            regexStr: localDatabaseMessage.regexStr,
            responses: localDatabaseMessage.responses,
            enabled: localDatabaseMessage.enabled
        }
    })

    if (saveToDatabase) {
        sharedData.botDoc.save()
    }

    return sharedData.botDoc.messages
}

const saveDatabase = async () => {
    const timers = saveTimers(false)
    const commands = saveCommands(false)
    const feedCount = saveLocalFeedCount(false)
    const quotes = saveLocalQuotes(false)
    const messages = saveLocalMessages(false)
    await timers
    await commands
    await feedCount
    await quotes
    await messages
    sharedData.botDoc.save()
    return sharedData.botDoc
}

//#endregion

//#region CRUD operations

//#region twitchClient CRUD

const setTwitchClient = (client) => {
    sharedData.twitchClient = client
}

//#endregion

//#region timers CRUD

const addTimer = timer => {
    sharedData.localDatabase.timers[timer.keyword] = timer
    saveTimers()
    return sharedData.localDatabase.timers
}

const setTimerDelay = (keyword, delay) => {
    const timer = sharedData.localDatabase.timers[keyword]
    timer.delay = delay
    timer.reset()
    saveTimers()
    return timer
}

const setTimerEnable = (keyword, enable) => {
    const timer = sharedData.localDatabase.commands[keyword]
    timer.setEnabled(enable)
    saveTimers()
    return timer
}

//#endregion

//#region commands CRUD

const addCommand = (command) => {
    sharedData.localDatabase.commands[command.keyword] = command
    saveCommands()
    return sharedData.localDatabase.commands
}

const setCommandPermission = (keyword, permission) => {
    const command = sharedData.localDatabase.commands[keyword]
    command.permission = sharedData.permissionHierarchy.indexOf(permission)
    saveCommands()
    return command
}

const setCommandEnable = (keyword, enable) => {
    const command = sharedData.localDatabase.commands[keyword]
    command.enable = enable
    saveCommands()
    return command
}

const deleteCommand = (keyword) => {
    delete sharedData.localDatabase.commands[keyword]
    saveCommands()
    return sharedData.localDatabase.commands
}

//#endregion

//#region feed count CRUD

const setFeedCount = (count) => {
    sharedData.localDatabase.feedCount = count
    saveFeedCount()
    return sharedData.localDatabase.feedCount
}

const incrementFeedCount = () => {
    return setFeedCount(sharedData.localDatabase.feedCount + 1)
}

//#endregion

//#region quotes CRUD

const addQuote = (quote) => {
    sharedData.localDatabase.quotes.push(quote)
    saveLocalQuotes()
    return sharedData.localDatabase.quotes
}

const editQuote = (quoteIndex, newQuote) => {
    sharedData.localDatabase.quotes[quoteIndex] = newQuote
    saveLocalQuotes()
    return sharedData.localDatabase.quotes
}

const deleteQuote = (quoteIndex) => {
    sharedData.localDatabase.quotes.splice(quoteIndex, 1)
    saveLocalQuotes()
    return sharedData.localDatabase.quotes
}

//#endregion

//#endregion

module.exports = {
    sharedData,
    loadBotDoc,
    loadTimers,
    loadCommands,
    loadFeedCount,
    loadQuotes,
    loadMessages,
    loadDatabase,
    saveTimers,
    saveCommands,
    saveFeedCount,
    saveQuotes,
    saveMessages,
    saveDatabase,
    setTwitchClient,
    addTimer,
    setTimerDelay,
    setTimerEnable,
    addCommand,
    setCommandPermission,
    setCommandEnable,
    deleteCommand,
    setFeedCount,
    incrementFeedCount,
    addQuote,
    editQuote,
    deleteQuote
}