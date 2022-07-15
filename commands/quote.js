const { sharedData, } = require('../api')
const { getRandom } = require('../utils')

const handler = ({ channel, userstate, messageParms }) => {
    const quotes = sharedData.localDatabase.quotes
    if (!messageParms) {
        const randomQuote = getRandom(quotes)
        return sharedData.twitchClient.say(channel, `${userstate.username}, for you, I choose quote ${randomQuote.index + 1}: ${randomQuote.element}`)
    }

    const quoteIndex = parseInt(messageParms) - 1
    if (quoteIndex === NaN) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, I have never heard that quote.`)
    }
    if (!quotes[quoteIndex]) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, you must pick a quote between 1 and ${quotes.length}.`)
    }

    sharedData.twitchClient.say(channel, `${userstate.username}, here is quote ${quoteIndex + 1}: ${quotes[quoteIndex]}`)
}

module.exports = handler