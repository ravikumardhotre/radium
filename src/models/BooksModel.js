const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({


    author_name: {
        type: String,
        required: true
    },
    author: {
        type: ObjectId,
        ref: 'myauthors'
    },
    price: Number,
    ratings: Number,
    publisher: {
        type: ObjectId,
        ref: 'mypublisher'
    }


}, { timestamps: true })

module.exports = mongoose.model('mybooks', bookSchema)