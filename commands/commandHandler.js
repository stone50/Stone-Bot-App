const { sharedData } = require('../api/sharedData')

const commandHandler = ({ channel, userstate, message, userPermission }) => {
    const messageArray = message.split(' ')
    const commandKeyword = messageArray.shift().slice(1)
    const messageParms = messageArray.join(' ')

    const parms = {
        channel,
        userstate,
        messageParms,
        userPermission
    }

    const commandObject = sharedData.localDatabase.commands[commandKeyword]

    if (!commandObject) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, !${commandKeyword} is not a command I know.`)
    }
    if (!commandObject.enabled) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, !${commandKeyword} is currently disabled.`)
    }
    if (commandObject.permission > userPermission) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, you do not have permission to use !${commandKeyword}.`)
    }

    commandObject.handler(parms)
}

module.exports = commandHandler