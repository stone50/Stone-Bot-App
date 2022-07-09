const { sharedData } = require('../api')

const handler = ({ channel }) => {
    sharedData.twitchClient.say(channel, 'HYPE')
}

module.exports = handler