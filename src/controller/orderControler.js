const orderModel = require("../models/orderModel")
const userModel = require('../models/userModel')
const productModel = require('../models/productModel')
const createOrder = async function(req, res) {
    // user validation
    let userId = req.body.userId
    let productId = req.body.productId

    let freeUser = req.isFreeAppUser
    let orderAmount
    let orderDate = Date()

    let user = await userModel.findById(userId)
    if (!user) {
        return res.send({ message: "User doesn't exist" })
    }

    let product = await productModel.findById(productId)
    if (!product) {
        return res.send({ message: "Product doesn't exist" })
    }


    if (!freeUser && user.balance < product.price) {
        return res.send({ message: "User doesn't have enough balance to purchase the product" })
    }
    if (freeUser) {
        orderAmount = 0
    } else {
        //paid app
        orderAmount = product.price
    }

    let orderDetails = {
        userId: userId,
        productId: productId,
        amount: orderAmount,
        isFreeAppUser: freeUser,
        date: orderDate
    }
    let orderCreated = await orderModel.create(orderDetails)
    if (!freeUser) {
        await userModel.findOneAndUpdate({ _id: userId }, { balance: user.balance - product.price })
    }
    res.send({ data: orderCreated })
}
module.exports.creatOrder = createOrder