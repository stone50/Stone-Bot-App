const { sharedData } = require('../api')

const handler = ({ channel, userstate }) => {
    sharedData.twitchClient.say(channel, `${userstate.username}, join us in our discourse at https://discord.com/invite/ANxbaZdRAY`)
}

module.exports = handler