const { sharedData } = require('../api/sharedData')

const handler = ({ channel }) => {
    sharedData.twitchClient.say(channel, 'HYPE')
}

module.exports = handler