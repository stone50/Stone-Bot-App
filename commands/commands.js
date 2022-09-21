const { sharedData } = require('../api/sharedData')

const handler = ({ channel, userstate, userPermission }) => {
    const commands = sharedData.localDatabase.commands
    const usableCommands = Object.keys(commands).filter(keyword => {
        const commandObject = commands[keyword]
        return commandObject.enabled && userPermission >= commandObject.permission
    }).sort()
    if (usableCommands.length === 0) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, you do not have access to any commands.`)
    }
    sharedData.twitchClient.say(channel, `${userstate.username}, you have access to !${usableCommands.join(', !')}`)
}

module.exports = handler