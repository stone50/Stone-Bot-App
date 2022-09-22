const { sharedData } = require('../api/sharedData')
const { addGameRule, rulesCharLimit } = require('../api/gameRules')

const handler = async ({ channel, userstate, messageParms }) => {
    let rulesLength = messageParms.length
    sharedData.localDatabase.gameRules.forEach(rule => rulesLength += rule.length)
    if (rulesLength > rulesCharLimit) {
        return sharedData.twitchClient.say(channel, `I'm sorry, ${userstate.username}, that rule is too long.`)
    }
    const gameRules = await addGameRule(messageParms)
    sharedData.twitchClient.say(channel, `Rule ${gameRules.length} has been added thanks to ${userstate.username}!`)
}

module.exports = handler