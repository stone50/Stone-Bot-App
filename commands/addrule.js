const { sharedData } = require('../api/sharedData')
const { addGameRule, deleteGameRule, maxRuleLength, maxRules } = require('../api/gameRules')

const handler = async ({ channel, userstate, messageParms }) => {
    if (messageParms.length > maxRuleLength) {
        return sharedData.twitchClient.say(channel, `I'm sorry, ${userstate.username}, that rule is too long.`)
    }
    if (sharedData.localDatabase.gameRules.length == maxRules) {
        await deleteGameRule(0, true)
    }
    await addGameRule(messageParms)
}

module.exports = handler