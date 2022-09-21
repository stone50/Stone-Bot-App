const { sharedData } = require('./sharedData')
const { botLog } = require('./logs')
const Message = require('../components/message')

const loadMessages = async () => {
    botLog('info', 'loading messages from bot document')
    sharedData.localDatabase.messages = {}
    Object.keys(sharedData.botDoc.messages).forEach(messageKeyword => {
        const botDocMessage = sharedData.botDoc.messages[messageKeyword]
        try {
            sharedData.localDatabase.messages[messageKeyword] = new Message(
                messageKeyword,
                botDocMessage.regexStr,
                require(`../messages/${messageKeyword}`),
                botDocMessage.enabled
            )
        } catch (err) {
            botLog('warn', `error loading ${messageKeyword} message`)
        }

    })
    return sharedData.localDatabase.messages
}

const saveMessages = async () => {
    botLog('info', 'saving messages to database')
    sharedData.botDoc.messages = {}
    Object.keys(sharedData.localDatabase.messages).forEach(messageKeyword => {
        const localDatabaseMessage = sharedData.localDatabase.messages[messageKeyword]
        sharedData.botDoc.messages[messageKeyword] = {
            keyword: messageKeyword,
            regexStr: localDatabaseMessage.regexStr,
            enabled: localDatabaseMessage.enabled
        }
    })

    await sharedData.botDoc.save()

    return sharedData.botDoc.messages
}

const setMessageEnable = async (keyword, enable, awaitSave = false) => {
    botLog('info', `${enable ? 'enabling' : 'disabling'} ${keyword} message`)
    const message = sharedData.localDatabase.messages[keyword]
    message.enabled = enable
    awaitSave ? await saveMessages() : saveMessages()
    return message
}

module.exports = {
    loadMessages,
    saveMessages,
    setMessageEnable
}