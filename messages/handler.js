const { sharedData } = require('../api')

const messageHandler = ({ channel, userstate, message }) => {
    Object.keys(sharedData.localDatabase.messages).forEach(messageKeyword => {
        const messageObject = sharedData.localDatabase.messages[messageKeyword]
        if (messageObject.enabled && messageObject.regex.test(message)) {
            messageObject.handler({ channel, userstate, message })
        }
    })
}

module.exports = messageHandler