const { sharedData, setCommandEnable } = require('../api')

const handler = async ({ channel, userstate, messageParms }) => {

    if (messageParms.substring(0, 6) === 'enable' || messageParms.substring(0, 7) === 'disable') {
        return sharedData.twitchClient.say(channel, `${userstate.username}, !${messageParms} cannot be disabled.`)
    }

    const commandObject = sharedData.localDatabase.commands[messageParms]
    if (!commandObject) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, I do not know !${messageParms}.`)
    }
    if (!commandObject.enabled) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, !${messageParms} is already disabled.`)
    }
    await setCommandEnable(messageParms, false)
    sharedData.twitchClient.say(channel, `!${commandKeyword} can no longer be used thanks to ${userstate.username}!`)
}

module.exports = handler