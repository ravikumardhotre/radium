const BooksModel = require("../models/BooksModel.js")
const AuthorModel = require("../models/AuthorModel.js")

/*
                               ASSIGNMENT 2------> 
You have to replicate the below data in your database. With this in mind, create a node application and APIs 



        api to create BookCollection in database with respect to the bookSchema              */

const createBook = async function(req, res) {
        var Bookdata = req.body
        let savedData = await BooksModel.create(Bookdata)
        res.send({ Book: savedData })
    }
    /*
         api to create AuthorCollection in database with respect to the AuthorSchema             */

const createAuthor = async function(req, res) {
        var Authordata = req.body
        let savedData = await AuthorModel.create(Authordata)
        res.send({ Author: savedData })
    }
    /*               List out the books written by Chetan Bhagat                                           */

const FindAuthor = async function(req, res) {
        let FindAuthore = await AuthorModel.findOne({ author_name: "Chetan Bhagat" }) //data of bhagat
        let savedData = await BooksModel.find({ author_id: FindAuthore.author_id })
        res.send({ BookName: savedData })
    }
    /* find the author of “Two states” and update the book price to 100; 
            Send back the author_name and updated price in response                                                    */

const changePrice = async function(req, res) {
        let savedData = await BooksModel.findOneAndUpdate({ name: "Two states" }, { price: 100 })
        let priceData = await AuthorModel.findOne({ author_id: savedData.author_id })
        res.send({ "updatedPrice": savedData.price, "authorName": priceData.author_name })
    }
    /*
    Find the books which costs between 50 - 100(50, 100 inclusive)
    and respond back with the author names of respective books                                 */

const authorBook = async function(req, res) {
    let data = await BooksModel.find({ $and: [{ price: { $lte: 100, $gte: 50 } }] }).select({ author_id: 1, _id: 0 })
    let authorNames = await AuthorModel.find({ $or: data }).select({ author_name: 1, _id: 0 })
    res.send({ AuthorNames: authorNames })
}

module.exports.createBook = createBook
module.exports.createAuthor = createAuthor
module.exports.FindAuthor = FindAuthor
module.exports.changePrice = changePrice
module.exports.authorBook = authorBook