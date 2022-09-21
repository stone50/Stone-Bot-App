const { sharedData } = require('../api/sharedData')
const { setTimerEnable } = require('../api/timers')

const handler = async ({ channel, userstate, messageParms }) => {
    const timerObject = sharedData.localDatabase.timers[messageParms]
    if (!timerObject) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, I do not know of the ${messageParms} timer.`)
    }
    if (!timerObject.getEnabled()) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, the ${messageParms} timer is already disabled.`)
    }
    await setTimerEnable(messageParms, false)
    sharedData.twitchClient.say(channel, `${userstate.username} has disabled the ${messageParms} timer!`)
}

module.exports = handler