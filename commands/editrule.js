const { sharedData } = require('../api/sharedData')
const { editGameRule, rulesCharLimit } = require('../api/gameRules')

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

    let rulesLength = 0
    gameRules.forEach((rule, index) => rulesLength += (index === gameRuleIndex) ? newGameRule.length : rule.length)
    if (rulesLength > rulesCharLimit) {
        return sharedData.twitchClient.say(channel, `I'm sorry, ${userstate.username}, that rule is too long.`)
    }

    await editGameRule(gameRuleIndex, newGameRule)
    sharedData.twitchClient.say(channel, `Rule ${gameRuleIndex + 1} has been edited thanks to ${userstate.username}!`)
}

module.exports = handler