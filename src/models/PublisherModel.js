const mongoose = require('mongoose')

const publisherSchema = new mongoose.Schema({

    name: String,
    hqheadQuarter: String
}, { timestamps: true })

module.exports = mongoose.model('mypublishers', publisherSchema)