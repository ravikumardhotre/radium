const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const loginmiddle = require('../middleware/loginmiddle')

router.post('/register', userController.userCreation)
router.post('/login', userController.userLogin)
    //router.get('/user/:userId/profile', loginmiddle.userAuth, userController.updateProfile)
    //router.put('/user/:userId/profile')

module.exports = router;