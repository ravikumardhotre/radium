const mongoose = require('mongoose');

const CryptoSchema = new mongoose.Schema({

    symbol: {
        type: String,
        unique: false
    },
    name: {
        type: String,
        unique: false
    },
    marketCapUsd: String,
    priceUsd: String,
}, {
    timestamp: true
})

module.exports = mongoose.model('CryptoCurrencies', CryptoSchema)

// "symbol" // String and Unqiue

// "name": // String and Unqiue

// "marketCapUsd": // String  ( not Number)

// "priceUsd": //String

// }