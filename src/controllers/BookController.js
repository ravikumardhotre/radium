const BooksModel = require("../models/BooksModel.js");
const mongoose = require('mongoose');
const AuthorModel = require("../models/AuthorModel.js");
const PublisherModel = require("../models/PublisherModel")



const createBook = async function(req, res) {
    const BookData = req.body
    let authorId = req.body.author
    let authorFromRequest = await AuthorModel.findById(authorId)
    let PublisherId = req.body.publisher
    let publisherFromRequest = await PublisherModel.findById(PublisherId)
    if (authorFromRequest && publisherFromRequest) {
        let savedBook = await BooksModel.create(BookData);
        res.send({ msg: savedBook })
    }
    res.send("Invalid id from the collections.....")

};

const getBook = async function(req, res) {
    let allBooks = await BooksModel.find().populate({ path: 'author', select: { 'author_name': 1, age: 1 } });
    res.send({ populatedBooks: allBooks });
};

const Books1 = async function(req, res) {
    let BooksData = await BooksModel.find().populate({ path: 'author', select: { 'author_name': 1, age: 1 } });
    // res.send({ populatedBooks: allBooks });
    res.send({ msg: BooksData })
}

module.exports.createBook = createBook;
module.exports.getBook = getBook;

module.exports.Books1 = Books1;