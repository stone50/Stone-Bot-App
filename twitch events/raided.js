const { sharedData } = require('../api')

const handler = (channel, username, viewers, userstate) => {
    sharedData.twitchClient.say(channel, `:O A raid!? Quickly, we must defend!`)
    setTimeout(() => {
        sharedData.twitchClient.say(channel, `Huzzah to ${username} for bringing great content! Find them at https://twitch.tv/${username}. HSCheers`)
    }, 10000)
}

module.exports = handler;