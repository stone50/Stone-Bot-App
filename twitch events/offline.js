const mongoose = require('mongoose')

const { saveDatabase, clearSharedData } = require('../api')

const handler = async () => {
    await saveDatabase()

    mongoose.disconnect()

    clearSharedData()
}

module.exports = handler