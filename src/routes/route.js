const express = require('express');
const router = express.Router();
const AuthorModel = require("../models/AuthorModel")
const BooksModel = require("../models/BooksModel")
const UserController = require("../controllers/userController")

// api for crud operation

router.post('/createBook', UserController.createBook); //creating book
router.post('/createAuthor', UserController.createAuthor); //creating author
router.get('/FindAuthor', UserController.FindAuthor); //finding author
router.get('/changePrice', UserController.changePrice); // updating price
router.get('/authorBook', UserController.authorBook); //finding perticular author 


module.exports = router;