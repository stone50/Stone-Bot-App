const { sharedData } = require('../api/sharedData')
const { editGameRule, maxRuleLength } = require('../api/gameRules')

const handler = async ({ channel, userstate, messageParms }) => {
    const gameRules = sharedData.localDatabase.gameRules

    if (gameRules.length === 0) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, there are no rules to edit!`)
    }

    const messageArray = messageParms.split(' ')
    const gameRuleIndex = parseInt(messageArray.shift()) - 1
    const newGameRule = messageArray.join(' ')

    if (gameRuleIndex === NaN || gameRuleIndex >= gameRules.length) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, you must choose a rule between 1 and ${gameRules.length}.`)
    }

    if (newGameRule.length > maxRuleLength) {
        return sharedData.twitchClient.say(channel, `I'm sorry, ${userstate.username}, that rule is too long.`)
    }

    await editGameRule(gameRuleIndex, newGameRule)
}

module.exports = handler