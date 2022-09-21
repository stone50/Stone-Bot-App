const { sharedData } = require('../api/sharedData')

const handler = ({ channel }) => {
    sharedData.twitchClient.say(channel, 'MUG MOMENT')
}

module.exports = handler