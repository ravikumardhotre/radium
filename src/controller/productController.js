const productModel = require("../models/productModel")

const creatProduct = async function(req, res) {
    let productData = req.body
    let savedData = await productModel.create(productData)
    res.send({ Product: savedData })
}


module.exports.creatProduct = creatProduct