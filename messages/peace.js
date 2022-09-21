const { sharedData } = require('../api/sharedData')

const handler = ({ channel }) => {
    sharedData.twitchClient.say(channel, 'PEACE')
}

module.exports = handler