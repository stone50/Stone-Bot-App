const { sharedData } = require('../api/sharedData')
const { addQuote } = require('../api/quotes')

const handler = async ({ channel, userstate, messageParms }) => {
    const quotes = await addQuote(messageParms)
    sharedData.twitchClient.say(channel, `Quote ${quotes.length} has been added thanks to ${userstate.username}!`)
}

module.exports = handler