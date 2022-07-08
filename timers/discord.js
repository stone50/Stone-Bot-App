const { sharedData } = require('../api')

const handler = () => {
    sharedData.twitchClient.say(sharedData.twitchClient.channels[0], `Join us in our discourse at https://discord.com/invite/ANxbaZdRAY`)
}

module.exports = handler;