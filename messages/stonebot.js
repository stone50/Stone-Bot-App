const { sharedData } = require('../api/sharedData')

const handler = ({ channel, userstate }) => {
    sharedData.twitchClient.say(channel, `MercyWing1 :) MercyWing2 ${userstate.username}, you called? `)
}

module.exports = handler