const { default: mongoose } = require('mongoose');

const randomRange = (min, max) => {
    return Math.floor((Math.random() * (max - min)) + min);
}

const quotesModel = mongoose.model('Quotes', mongoose.Schema({
    quotes: [String]
}));

const getQuotesObject = callback => {
    quotesModel.findOne((err, quotesObject) => {
        if (err) {
            return console.log(err);
        }

        callback(quotesObject);
    });
}

class API {
    static addQuote(quote, callback) {
        getQuotesObject(quotesObject => {
            quotesObject.quotes.push(quote);

            quotesObject.save().then(savedQuotes => {
                callback(savedQuotes.quotes);
            });
        });
    }

    static getQuote(quoteIndex, callback) {
        getQuotesObject(quotesObject => {
            callback(quotesObject.quotes[quoteIndex]);
        });
    }

    static getRandomQuote(callback) {
        getQuotesObject(quotesObject => {
            const quoteIndex = randomRange(0, quotesObject.quotes.length);
            callback(quotesObject.quotes[quoteIndex], quoteIndex);
        });
    }

    static getQuoteCount(callback) {
        getQuotesObject(quotesObject => {
            callback(quotesObject.quotes.length);
        });
    }

    static deleteQuote(quoteIndex, callback) {
        getQuotesObject(quotesObject => {
            quotesObject.quotes.splice(quoteIndex, 1);
            quotesObject.save().then(savedQuotes => {
                callback(savedQuotes.quotes);
            });
        });
    }

    static editQuote(quoteIndex, newQuote, callback) {
        getQuotesObject(quotesObject => {
            quotesObject.quotes[quoteIndex] = newQuote;
            quotesObject.save().then(savedQuotes => {
                callback(savedQuotes.quotes);
            });
        });
    }
}

module.exports = API;