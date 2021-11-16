const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({

    /*
    Create a books collection in your DB(using bookModel with following fields) - bookName(mandatory field), price containing Indian and european price, year(should be 2021
        if no year is provided), tags array, authorName, totalPages, stockAvailable(true false)
    */
    bookName: {
        type: String,
        required: true,
        unique: true,
    },
    authorName: {
        type: String,
        required: true,
        unique: true,
    },

    year: {
        type: Number,
        default: 2021
    },
    category: {
        type: String,
        required: true
    },
    prices: {
        indianPrice: String,
        europeanPrice: String
    },
    tags: [String],
    totalPages: Number,
    stockAvailable: Boolean,
    default: false
}, { timestamps: true })


module.exports = mongoose.model('Book1', bookSchema)