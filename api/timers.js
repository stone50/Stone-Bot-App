const { sharedData } = require('./sharedData')
const { botLog } = require('./logs')

const Timer = require('../components/timer')

const loadTimers = async () => {
    botLog('info', 'loading timers from bot document')
    sharedData.localDatabase.timers = {}
    Object.keys(sharedData.botDoc.timers).forEach(timerKeyword => {
        const botDocTimer = sharedData.botDoc.timers[timerKeyword]
        sharedData.localDatabase.timers[timerKeyword] = new Timer(
            timerKeyword,
            require(`../timers/${timerKeyword}`),
            botDocTimer.delay,
            botDocTimer.enabled
        )
    })
    return sharedData.localDatabase.timers
}

const saveTimers = async () => {
    botLog('info', 'saving timers to database')
    sharedData.botDoc.timers = {}
    Object.keys(sharedData.localDatabase.timers).forEach(timerKeyword => {
        const localDatabaseTimer = sharedData.localDatabase.timers[timerKeyword]
        sharedData.botDoc.timers[timerKeyword] = {
            keyword: timerKeyword,
            delay: localDatabaseTimer.delay,
            enabled: localDatabaseTimer.getEnabled()
        }
    })

    await sharedData.botDoc.save()

    return sharedData.botDoc.timers
}

const setTimerEnable = async (keyword, enable, awaitSave = false) => {
    botLog('info', `${enable ? 'enabling' : 'disabling'} ${keyword} timer`)
    const timer = sharedData.localDatabase.timers[keyword]
    timer.setEnabled(enable)
    awaitSave ? await saveTimers() : saveTimers()
    return timer
}

module.exports = {
    loadTimers,
    saveTimers,
    setTimerEnable
}