const { model, Schema } = require('mongoose')

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
    gameRules: [String]
}))

const logModel = model('logs', new Schema({
    timestamp: Date,
    level: String,
    message: String
}))

module.exports = {
    timerSchema,
    commandSchema,
    messageSchema,
    botModel,
    logModel
}