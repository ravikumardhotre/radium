const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,

    },
    balance: {
        type: Number,
        default: 100,
    },
    address: String,
    age: Number,
    gender: { type: String, enum: ["male", "female", "other"] },
    freeAppUser: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


module.exports = mongoose.model('Users', UserSchema)