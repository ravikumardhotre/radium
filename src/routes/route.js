const express = require('express');
const router = express.Router();


// const UserModel = require("../models/userModel")
// const BookModule = require("../models/bookModel")


const UserController = require("../controllers/userController")
const BookController = require("../controllers/bookController")


router.get('/test-me', function(req, res) {
    res.send('My first ever api!')
});

router.post('/createUser', UserController.createUser);
router.get('/getAllUsers', UserController.getUsersData);


router.post('/creatBook', BookController.creatBook);
router.get('/getAllBooks', BookController.getBookData);

module.exports = router;