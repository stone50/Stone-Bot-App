const { sharedData } = require('../api')
const messageHandler = require('../message_handler')
const commandHandler = require('../commands/command_handler')

const handler = (channel, userstate, message, self) => {

    if (self) return

    let userPermission = sharedData.permissionHierarchy.indexOf('viewer')
    if (userstate.username == channel) {
        userPermission = sharedData.permissionHierarchy.indexOf('streamer')
    } else if (userstate.mod) {
        userPermission = sharedData.permissionHierarchy.indexOf('mod')
    } else if (userstate.subscriber) {
        userPermission = sharedData.permissionHierarchy.indexOf('sub')
    }

    const lowerMessage = message.toLocaleLowerCase()

    const parms = {
        channel,
        userstate,
        message: lowerMessage,
        userPermission
    }

    if (lowerMessage.charAt(0) == '!') {
        return commandHandler(parms)
    }

    messageHandler(parms)
}

module.exports = handler;