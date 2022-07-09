const { sharedData } = require('../api')

const handler = ({ channel }) => {
    sharedData.twitchClient.say(channel, 'Hahaha')
}

module.exports = handler