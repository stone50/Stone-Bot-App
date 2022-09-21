const { sharedData } = require('../api/sharedData')

const handler = ({ channel }) => {
    sharedData.twitchClient.say(channel, 'Hahaha')
}

module.exports = handler