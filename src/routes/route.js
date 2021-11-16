const express = require('express');
const router = express.Router();
const UserModel = require("../models/userModel")

const UserController = require("../controllers/userController")
const BookController = require("../controllers/bookController")


router.get('/test-me', function(req, res) {
    res.send('My first ever api!')
});

// this are the api

router.post('/createBook', BookController.createBook);
router.get('/getAllBooks', BookController.getBooksData);

router.post('/getBooksInYear', BookController.getBooksInYear)
router.post('/getParticularBooks', BookController.getParticularBooks)

router.get('/getXINRBooks', BookController.getXINRBooks)
router.get('/getRandomBooks', BookController.getRandomBooks)

module.exports = router;