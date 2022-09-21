const { sharedData } = require('../api/sharedData')
const { editQuote } = require('../api/quotes')

const handler = async ({ channel, userstate, messageParms }) => {
    const messageArray = messageParms.split(' ')
    const quoteIndex = parseInt(messageArray.shift()) - 1
    const newQuote = messageArray.join(' ')

    const quotes = sharedData.localDatabase.quotes

    if (quoteIndex === NaN || quoteIndex >= quotes.length) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, you must choose a quote between 1 and ${quotes.length}.`)
    }
    await editQuote(quoteIndex, newQuote)
    sharedData.twitchClient.say(channel, `Quote ${quoteIndex + 1} has been edited thanks to ${userstate.username}!`)
}

module.exports = handler