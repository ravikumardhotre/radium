const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    category: String,
    price: {
        type: String,
        required: true
    },

}, { timestamps: true })


module.exports = mongoose.model('Products', ProductSchema)