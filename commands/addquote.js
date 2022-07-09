const { sharedData, addQuote } = require('../api')

const handler = async ({ channel, userstate, messageParms }) => {
    const quotes = await addQuote(messageParms)
    sharedData.twitchClient.say(channel, `Quote ${quotes.length} has been added thanks to ${userstate.username}!`)
}

module.exports = handler