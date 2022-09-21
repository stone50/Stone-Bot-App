const { sharedData } = require('../api/sharedData')
const { setCommandEnable } = require('../api/commands')

const handler = async ({ channel, userstate, messageParms }) => {
    const commandObject = sharedData.localDatabase.commands[messageParms]
    if (!commandObject) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, I do not know !${messageParms}.`)
    }
    if (commandObject.enabled) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, !${messageParms} is already enabled.`)
    }
    await setCommandEnable(messageParms, true)
    sharedData.twitchClient.say(channel, `!${messageParms} can be used again thanks to ${userstate.username}!`)
}

module.exports = handler