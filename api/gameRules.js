const { sharedData } = require('./sharedData')
const { botLog } = require('./logs')

const loadGameRules = async () => {
    botLog('info', 'loading game rules from bot document')
    sharedData.localDatabase.gameRules = sharedData.botDoc.gameRules
    return sharedData.localDatabase.gameRules
}

module.exports = {
    loadGameRules
}