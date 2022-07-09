const { sharedData, deleteQuote } = require('../api')

const handler = async ({ channel, userstate, messageParms }) => {
    const quotes = sharedData.localDatabase.quotes
    const quoteIndex = parseInt(messageParms) - 1

    if (quoteIndex == NaN || quoteIndex >= quotes.length) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, you must choose a quote between 1 and ${quotes.length}.`)
    }
    await deleteQuote(quoteIndex)
    sharedData.twitchClient.say(channel, `Quote ${quoteIndex + 1} has been deleted thanks to ${userstate.username}!`)
}

module.exports = handler