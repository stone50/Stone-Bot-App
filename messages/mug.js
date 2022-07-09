const { sharedData } = require('../api')

const handler = ({ channel }) => {
    sharedData.twitchClient.say(channel, 'MUG MOMENT')
}

module.exports = handler