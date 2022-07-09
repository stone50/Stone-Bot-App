const { sharedData, setTimerEnable } = require('../api')

const handler = async ({ channel, userstate, messageParms }) => {
    const timerObject = sharedData.localDatabase.timers[messageParms]
    if (!timerObject) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, I do not know of the ${messageParms} timer.`)
    }
    if (timerObject.enabled) {
        return sharedData.twitchClient.say(channel, `${userstate.username}, the ${messageParms} timer is already enabled.`)
    }
    await setTimerEnable(messageParms, true)
    sharedData.twitchClient.say(channel, `${userstate.username} has enabled the ${messageParms} timer!`)
}

module.exports = handler