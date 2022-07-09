const { sharedData } = require('../api')
const { getRandom } = require('../utils')

const handler = ({ channel }) => {
    sharedData.twitchClient.say(channel, `Here's a chess tip: ${getRandom(sharedData.localDatabase.chessTips).element}`)
}

module.exports = handler