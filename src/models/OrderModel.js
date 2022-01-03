const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const orderSchema = new mongoose.Schema({
    userId: { type: ObjectId, ref: 'User_details', require: true },
    items: [{
        _id: false,
        productId: { type: ObjectId, ref: 'Product_details', require: true },
        quantity: { type: Number, require: true }
    }],
    totalPrice: { type: Number, require: true },
    totalItems: { type: Number, require: true },
    totalQuantity: { type: Number, require: true },
    cancellable: { type: Boolean, default: true },
    status: { type: String, default: 'pending', enum: ["pending", "completed", "cancled"] },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Order_details', orderSchema)