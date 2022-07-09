const { sharedData } = require('../api')

const setupEventHandlers = () => {

    sharedData.twitchClient.on('hosted', require('./hosted'))

    sharedData.twitchClient.on('join', require('./join'))

    sharedData.twitchClient.on('message', require('./message'))

    sharedData.twitchClient.on('raided', require('./raided'))
}

module.exports = setupEventHandlers