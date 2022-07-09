const { sharedData } = require('../api')
const messageHandler = require('../messages/handler')
const commandHandler = require('../commands/handler')

const handler = (channel, userstate, message, self) => {

    if (self) return

    channel = channel.slice(1)
    message = message.toLocaleLowerCase()

    let userPermission = sharedData.permissionHierarchy.indexOf('viewer')
    if (userstate.username == channel) {
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

    if (message.charAt(0) == '!') {
        return commandHandler(parms)
    }

    messageHandler(parms)
}

module.exports = handler