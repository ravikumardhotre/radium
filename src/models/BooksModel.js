const mongoose = require('mongoose')

// this is schema for books 

const bookSchema = new mongoose.Schema({

    name: String,

    author_id: {
        type: Number,
        required: true
    },

    price: Number,


    ratings: Number,

}, { timestamps: true })

module.exports = mongoose.model('newbook', bookSchema)