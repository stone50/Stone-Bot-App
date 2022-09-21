const { sharedData } = require('../api/sharedData')
const { botLog } = require('../api/logs')

const handler = (channel, username, self) => {
    botLog('info', `tmi join event hit by ${username}`)

    if (self) {
        return sharedData.twitchClient.say(channel, `MercyWing1 :) MercyWing2 I have arrived!`)
    }
}

module.exports = handler