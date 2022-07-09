const { sharedData, setMessageEnable } = require('../api')

const handler = async ({ channel, userstate, messageParms }) => {
    const messageObject = sharedData.localDatabase.messages[messageParms]
    if (!messageObject) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, I do not know the ${messageParms} message.`)
    }
    if (messageObject.enabled) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, the ${messageParms} message is already enabled.`)
    }
    await setMessageEnable(messageParms, true)
    sharedData.twitchClient.say(channel, `The ${messageParms} message can be used again thanks to ${userstate.username}!`)
}

module.exports = handler