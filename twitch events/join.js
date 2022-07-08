const { sharedData } = require('../api')

const handler = (channel, username, self) => {
    if (self) {
        return sharedData.twitchClient.say(channel, `MercyWing1 :) MercyWing2 I have arrived!`)
    }
}

module.exports = handler;