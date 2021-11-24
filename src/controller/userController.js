const userModel = require("../models/userModel")


const creatUser = async function(req, res) {
    let userData = req.body
    userData.freeAppUser = req.isFreeAppUser
    let savedData = await userModel.create(userData)
    res.send({ createdUser: savedData })
}

module.exports.creatUser = creatUser