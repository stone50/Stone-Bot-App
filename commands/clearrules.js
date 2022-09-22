const { sharedData } = require('../api/sharedData')
const { clearGameRules } = require('../api/gameRules')

const handler = async ({ channel, userstate }) => {
    await clearGameRules()
    sharedData.twitchClient.say(channel, `${userstate.username} has cleared all the rules!`)
}

module.exports = handler