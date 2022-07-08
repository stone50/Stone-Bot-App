const { sharedData } = require('./api')
const { getRandom } = require('./utils')

const messageHandler = ({ channel, message }) => {
    Object.keys(sharedData.localDatabase.messages).forEach(messageKeyword => {
        const messageObject = sharedData.localDatabase.messages[messageKeyword]
        if (messageObject.regex.test(message)) {
            sharedData.twitchClient.say(channel, getRandom(messageObject.responses).element)
        }
    })
}

module.exports = messageHandler;