const { sharedData } = require('./sharedData')
const { botLog } = require('./logs')

const loadQuotes = async () => {
    botLog('info', 'loading quotes from bot document')
    sharedData.localDatabase.quotes = sharedData.botDoc.quotes
    return sharedData.localDatabase.quotes
}

const saveQuotes = async () => {
    botLog('info', 'saving quotes to database')
    sharedData.botDoc.quotes = sharedData.localDatabase.quotes

    await sharedData.botDoc.save()

    return sharedData.botDoc.quotes
}

const addQuote = async (quote, awaitSave = false) => {
    botLog('info', `adding quote ${quote}`)
    sharedData.localDatabase.quotes.push(quote)
    awaitSave ? await saveQuotes() : saveQuotes()
    return sharedData.localDatabase.quotes
}

const editQuote = async (quoteIndex, newQuote, awaitSave = false) => {
    botLog('info', `editing quote ${quoteIndex} to say "${newQuote}"`)
    sharedData.localDatabase.quotes[quoteIndex] = newQuote
    awaitSave ? await saveQuotes() : saveQuotes()
    return sharedData.localDatabase.quotes
}

const deleteQuote = async (quoteIndex, awaitSave = false) => {
    botLog('info', `deleting quote ${quoteIndex}`)
    sharedData.localDatabase.quotes.splice(quoteIndex, 1)
    awaitSave ? await saveQuotes() : saveQuotes()
    return sharedData.localDatabase.quotes
}

module.exports = {
    loadQuotes,
    saveQuotes,
    addQuote,
    editQuote,
    deleteQuote
}