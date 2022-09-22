const fs = require('fs')

const { sharedData } = require('./sharedData')
const { botLog } = require('./logs')

const gameRuleFilePath = './game rules.txt'
const maxRuleLength = 30
const maxRules = 4

const loadGameRules = async () => {
    botLog('info', 'loading game rules from bot document')
    sharedData.localDatabase.gameRules = sharedData.botDoc.gameRules
    loadGameRulesToFile()
    return sharedData.localDatabase.gameRules
}

const loadGameRulesToFile = async () => {
    try {
        clearGameRulesFromFile()

        botLog('info', 'writing game rules to local file')
        sharedData.localDatabase.gameRules.forEach((rule, index) => {
            fs.appendFileSync(gameRuleFilePath, `${index + 1}. ${rule}\r\n`)
        })
    } catch (err) {
        botLog('warn', `could not load game rules to file: ${err}`)
    }
}

const saveGameRules = async () => {
    botLog('info', 'saving game rules to database')
    sharedData.botDoc.gameRules = sharedData.localDatabase.gameRules

    await sharedData.botDoc.save()

    return sharedData.botDoc.gameRules
}

const clearGameRulesFromFile = async () => {
    botLog('info', 'clearing game rules from local file')
    fs.truncateSync(gameRuleFilePath, 0)
}

const addGameRule = async (gameRule, awaitSave = false) => {
    botLog('info', `adding game rule ${gameRule}`)
    sharedData.localDatabase.gameRules.push(gameRule)
    loadGameRulesToFile()
    awaitSave ? await saveGameRules() : saveGameRules()
    return sharedData.localDatabase.gameRules
}

const editGameRule = async (gameRuleIndex, newGameRule, awaitSave = false) => {
    botLog('info', `editing game rule ${gameRuleIndex} to say "${newGameRule}"`)
    sharedData.localDatabase.gameRules[gameRuleIndex] = newGameRule
    loadGameRulesToFile()
    awaitSave ? await saveGameRules() : saveGameRules()
    return sharedData.localDatabase.gameRules
}

const deleteGameRule = async (gameRuleIndex, awaitSave = false) => {
    botLog('info', `deleting game rule ${gameRuleIndex}`)
    sharedData.localDatabase.gameRules.splice(gameRuleIndex, 1)
    loadGameRulesToFile()
    awaitSave ? await saveGameRules() : saveGameRules()
    return sharedData.localDatabase.gameRules
}

const clearGameRules = async (awaitSave = false) => {
    botLog('info', 'clearing game rules')
    sharedData.localDatabase.gameRules = []
    loadGameRulesToFile()
    awaitSave ? await saveGameRules() : saveGameRules()
    return sharedData.localDatabase.gameRules
}

module.exports = {
    gameRuleFilePath,
    maxRuleLength,
    maxRules,
    loadGameRules,
    loadGameRulesToFile,
    saveGameRules,
    clearGameRulesFromFile,
    addGameRule,
    editGameRule,
    deleteGameRule,
    clearGameRules
}