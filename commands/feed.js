const { randomRange } = require('../utils')
const { sharedData, incrementFeedCount } = require('../api')

const handler = async ({ channel, userstate }) => {
    if (randomRange(0, 10) == 0) {
        return sharedData.twitchClient.say(channel, `RaccAttack Crayon Oh no! A raccoon stole the crayon, ${userstate.username}!`)
    }
    const feedCount = await incrementFeedCount()
    sharedData.twitchClient.say(channel, `popCat Crayon ${userstate.username}, thank you for feeding the cat! The cat has been fed ${feedCount} times.`)
}

module.exports = handler