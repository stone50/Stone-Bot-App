const { sharedData } = require('./sharedData')
const { botLog } = require('./logs')

const loadFeedCount = async () => {
    botLog('info', 'loading feed count from bot document')
    sharedData.localDatabase.feedCount = sharedData.botDoc.feedCount
    return sharedData.localDatabase.feedCount
}

const saveFeedCount = async () => {
    botLog('info', 'saving feed count to database')
    sharedData.botDoc.feedCount = sharedData.localDatabase.feedCount

    await sharedData.botDoc.save()

    return sharedData.botDoc.feedCount
}

const incrementFeedCount = async (awaitSave = false) => {
    botLog('info', 'incrementing feed count')
    sharedData.localDatabase.feedCount++
    awaitSave ? await saveFeedCount() : saveFeedCount()
    return sharedData.localDatabase.feedCount
}

module.exports = {
    loadFeedCount,
    saveFeedCount,
    incrementFeedCount
}