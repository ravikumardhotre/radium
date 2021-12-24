const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const middleware1 = require('../middleware/loginmiddle')

router.post('/register', userController.userCreation)
router.post('/login', userController.userLogin)
router.get('/user/:userId/profile', middleware1, userController.getUserDetails)
router.put('/user/:userId/profile', middleware1, userController.updateUser)

module.exports = router;
