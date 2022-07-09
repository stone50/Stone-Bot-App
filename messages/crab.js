const { sharedData } = require('../api')
const { getRandom } = require('../utils')

const handler = ({ channel }) => {
    sharedData.twitchClient.say(channel, `Here's a fact about crabs: ${getRandom(sharedData.localDatabase.crabFacts).element}`)
}

module.exports = handler