const { clearGameRules } = require('../api/gameRules')

const handler = async () => {
    await clearGameRules()
}

module.exports = handler