const { sharedData } = require('./sharedData')
const { botLog } = require('./logs')
const Command = require('../components/command')

const loadCommands = async () => {
    botLog('info', 'loading commands from bot document')
    sharedData.localDatabase.commands = {}
    Object.keys(sharedData.botDoc.commands).forEach(commandKeyword => {
        const botDocCommand = sharedData.botDoc.commands[commandKeyword]
        sharedData.localDatabase.commands[commandKeyword] = new Command(
            commandKeyword,
            require(`../commands/${commandKeyword}`),
            sharedData.permissionHierarchy.indexOf(botDocCommand.permission),
            botDocCommand.enabled
        )
    })
    return sharedData.localDatabase.commands
}

const saveCommands = async () => {
    botLog('info', 'saving commands to database')
    sharedData.botDoc.commands = {}
    Object.keys(sharedData.localDatabase.commands).forEach(commandKeyword => {
        const localDatabaseCommand = sharedData.localDatabase.commands[commandKeyword]
        sharedData.botDoc.commands[commandKeyword] = {
            keyword: commandKeyword,
            permission: sharedData.permissionHierarchy[localDatabaseCommand.permission],
            enabled: localDatabaseCommand.enabled
        }
    })

    await sharedData.botDoc.save()

    return sharedData.botDoc.commands
}

const setCommandEnable = async (keyword, enable, awaitSave = false) => {
    botLog('info', `${enable ? 'enabling' : 'disabling'} ${keyword} command`)
    const command = sharedData.localDatabase.commands[keyword]
    command.enabled = enable
    awaitSave ? await saveCommands() : saveCommands()
    return command
}

module.exports = {
    loadCommands,
    saveCommands,
    setCommandEnable
}