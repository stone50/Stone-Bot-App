const { sharedData, botLog } = require('../api')

const handler = (channel, username, viewers, autohost) => {
    botLog('info', `tmi hosted event hit by ${username} with ${viewers} viewers${autohost ? ' with autohost' : ''}`)
    sharedData.twitchClient.say(channel, `:O We're being hosted? Time to put on a good show!`)
}

module.exports = handler