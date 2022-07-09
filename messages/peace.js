const { sharedData } = require('../api')

const handler = ({ channel }) => {
    sharedData.twitchClient.say(channel, 'PEACE')
}

module.exports = handler