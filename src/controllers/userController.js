const mongoose = require("mongoose")
const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken')

//       1-  To Register a user
const createUser = async function(req, res) {
    let data = req.body;
    let savedData = await userModel.create(data);
    res.send({ message: savedData })
}

//       2- Validate credentials of the user
//      If  user is valid  then create a json web token.
const Userlogin = async function(req, res) {
    userName = req.body.name;
    userPassword = req.body.password;

    let user = await userModel.findOne({ name: userName, password: userPassword, isDeleted: false })
    if (user) {
        const tokenGenerate = jwt.sign({ userId: user._id }, "radium")
        res.send({ status: true, data: user._id, token: tokenGenerate })
    } else {
        res.send({ status: false, message: "Invalid User name or password !! , plese put right credentials " })
    }
};

// 3 - return the user's details if found else return an error message 
const getDetails = async function(req, res) {
    let userId = req.params.userId
    let userDetails = await userModel.findOne({ _id: userId, isDeleted: false })

    if (userDetails) {
        res.send({ status: true, data: userDetails })
    } else {
        res.send({ status: false, message: 'User not found' })
    }
};

//         4- update user's email. 
const updateUser = async function(req, res) {
    let userId = req.params.userId
    let newEmail = req.body.email
    let userDetails = await userModel.findOneAndUpdate({ _id: userId }, { email: newEmail }, { new: true })
    if (userDetails) {
        res.send({ status: true, message: userDetails })
    } else {
        res.send({ status: false, msg: "Incorrect credentials !" })
    }
};

module.exports.createUser = createUser;
module.exports.Userlogin = Userlogin;
module.exports.getDetails = getDetails;
module.exports.updateUser = updateUser;