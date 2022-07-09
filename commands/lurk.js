const { sharedData } = require('../api')

const handler = ({ channel, userstate }) => {
    sharedData.twitchClient.say(channel, `${userstate.username}, thank you for your presence!`)
}

module.exports = handler