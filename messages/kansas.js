const { sharedData } = require('../api')
const { getRandom } = require('../utils')

const handler = ({ channel }) => {
    sharedData.twitchClient.say(channel, `Here's a fact about Kansas: ${getRandom(sharedData.localDatabase.kansasFacts).element}`)
}

module.exports = handler