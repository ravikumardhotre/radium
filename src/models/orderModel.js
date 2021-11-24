const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;
const OrderSchema = new mongoose.Schema({

    userId: {
        type: ObjectId,
        required: true,
        unique: true,
    },
    productId: {
        type: ObjectId,
        required: true,
        unique: true,
    },
    amount: Number,
    isFreeAppUser: Boolean,
    date: Date,
}, { timestamps: true })


module.exports = mongoose.model('Orders', OrderSchema)