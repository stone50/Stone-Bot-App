const { sharedData } = require('../api')
const { getRandom } = require('../utils')

const handler = () => {
    const channel = sharedData.twitchClient.channels[0]
    const randomQuote = getRandom(sharedData.localDatabase.quotes)
    sharedData.twitchClient.say(channel, `Time for a random quote by ${channel}! Quote ${randomQuote.index + 1}: ${randomQuote.element}`);
}

module.exports = handler;