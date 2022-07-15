const { randomRange } = require('../utils')
const { sharedData } = require('../api')

const handler = ({ channel, userstate }) => {
    if (randomRange(0, 10) === 0) {
        return sharedData.twitchClient.say(channel, `RaccAttack Oh no! A raccoon stole the hug, ${userstate.username}!`)
    }
    sharedData.twitchClient.say(channel, `catKISS ${userstate.username}, thank you for hugging the cat!`)
}

module.exports = handler