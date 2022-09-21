const { botLog } = require('./logs')

const defaultSharedData = {
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
        gameRules: []
    }
}

const sharedData = defaultSharedData

const clearSharedData = () => {
    botLog('info', 'clearing shared data')
    sharedData.twitchClient = defaultSharedData.twitchClient
    sharedData.permissionHierarchy = defaultSharedData.permissionHierarchy
    sharedData.botDoc = defaultSharedData.botDoc
    sharedData.localDatabase = defaultSharedData.localDatabase
}

module.exports = {
    sharedData,
    clearSharedData
}