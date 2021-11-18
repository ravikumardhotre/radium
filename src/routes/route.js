const express = require('express');
const router = express.Router();

const AuthorController = require("../controllers/AuthorController")
const BookController = require("../controllers/BookController")
const PublisherController = require("../controllers/PublisherController")


//  to create the Authors API
router.post('/Creatauthors', AuthorController.Creatauthors);


// to create the books API
router.post('/createBook', BookController.createBook);


router.get('/getBook', BookController.getBook);
router.get('/Books1 ', BookController.Books1)
    //  To create Publisher API
router.post('/createPublisher', PublisherController.createPublisher)







module.exports = router;