const express = require('express');
const router = express.Router();

const middleWare = require("../middlewares/Tokenmid")
const controller = require("../controllers/userController")

// to create the user
router.post('/createUser', controller.createUser)
    // To check login and generate token
router.post('/Userlogin', controller.Userlogin)
    // get user details by userId
router.get('/user/:userId', middleWare.tokenValidation, controller.getDetails)
    // update the user property 
router.put('/updateUser/:userId', middleWare.tokenValidation, controller.updateUser)

module.exports = router;