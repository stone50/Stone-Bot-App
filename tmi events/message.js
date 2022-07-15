const { sharedData, botLog } = require('../api')
const messageHandler = require('../messages/messageHandler')
const commandHandler = require('../commands/commandHandler')

const handler = (channel, userstate, message, self) => {
    botLog('info', `tmi message event hit by ${userstate.username} with message: ${message}`)

    if (self) return

    channel = channel.slice(1)
    message = message.toLocaleLowerCase()

    let userPermission = sharedData.permissionHierarchy.indexOf('viewer')
    if (userstate.username === channel) {
        userPermission = sharedData.permissionHierarchy.indexOf('streamer')
    } else if (userstate.mod) {
        userPermission = sharedData.permissionHierarchy.indexOf('mod')
    } else if (userstate.subscriber) {
        userPermission = sharedData.permissionHierarchy.indexOf('sub')
    }

    const parms = {
        channel,
        userstate,
        message,
        userPermission
    }

    if (message.charAt(0) === '!') {
        botLog('info', 'message detected as command')
        return commandHandler(parms)
    }

    botLog('info', 'checking for message matches')
    messageHandler(parms)
}

module.exports = handler