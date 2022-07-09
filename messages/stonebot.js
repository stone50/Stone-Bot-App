const { sharedData } = require('../api')

const handler = ({ channel, userstate }) => {
    sharedData.twitchClient.say(channel, `MercyWing1 :) MercyWing2 ${userstate.username}, you called? `)
}

module.exports = handler