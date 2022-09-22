const { sharedData } = require('../api/sharedData')
const { deleteGameRule } = require('../api/gameRules')

const handler = async ({ channel, userstate, messageParms }) => {
    const gameRules = sharedData.localDatabase.gameRules

    if (gameRules.length === 0) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, there are no rules to delete!`)
    }

    const gameRuleIndex = parseInt(messageParms) - 1

    if (gameRuleIndex === NaN || gameRuleIndex >= gameRules.length) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, you must choose a rule between 1 and ${gameRules.length}.`)
    }
    await deleteGameRule(gameRuleIndex)
    sharedData.twitchClient.say(channel, `Rule ${gameRuleIndex + 1} has been deleted thanks to ${userstate.username}!`)
}

module.exports = handler