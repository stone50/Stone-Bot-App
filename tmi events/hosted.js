const { sharedData } = require('../api')

const handler = (channel, username, viewers, autohost) => {
    sharedData.twitchClient.say(channel, `:O We're being hosted? Time to put on a good show!`)
}

module.exports = handler