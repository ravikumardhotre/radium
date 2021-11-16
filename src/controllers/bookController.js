const BookModel = require("../models/bookModel.js")
const mongoose = require("mongoose")

/*
                                                         Assignment:2

    Create a books collection in your DB(using bookModel with following fields) - bookName(mandatory field), price containing Indian and european price, year(should be 2021
        if no year is provided), tags array, authorName, totalPages, stockAvailable(true false)

create the following API’ s(write logic in bookController and routes in routes):                                                                  */

/*
                                                      Task1-- - >

createBook: to create a new entry..use this api to create 11 + entries in your collection                                                         */

const createBook = async function(req, res) {
        const book = req.body
        let savedBook = await BookModel.create(book)
        res.send({ msg: savedBook })
    }
    /*                                                 Task2-- - >
                  bookList : gives all the books- their bookName and authorName only                                    
                                                                                                                                           */
const getBooksData = async function(req, res) {

        let allBooks = await BookModel.find().select({ bookName: 1, authorName: 1 })
        res.send({ msg: allBooks })
    }
    /*                                    Task 3-- - >

getBooksInYear: takes year as input in post request and gives list of all books published that year                                          */

const getBooksInYear = async function(req, res) {
        let allBooks = await BookModel.find({ year: req.body.year })
        res.send({ msg: allBooks })
    }
    /*                                        Task 4---->
    getParticularBooks:- (this is a good one, make sincere effort to solve this) take any input and use it as
     a condition to fetch books that satisfy that condition
    		
    e.g if body had { name: “hi”} then you would fetch the books with this name
    		
    if body had { year: 2020} then you would fetch the books with this name
    		
    hence the condition will differ based on what you input in the request body                                           */

const getParticularBooks = async function(req, res) {
        let allBooks = await BookModel.find(req.body)
        res.send({ msg: allBooks })
    }
    /*                                        Task 5-- -- >

    getXINRBooks- request to return all books who have an Indian price tag of “100INR” or “200INR” or “500INR”                */

const getXINRBooks = async function(req, res) {
        let allBooks = await BookModel.find({ 'prices.indianPrice': { $in: ["100", "200", "500"] } })

        res.send({ msg: allBooks })
    }
    /*
                                             Task 6----->
                              
                   getRandomBooks - returns books that are available in stock or have more than 500 pages                    */

const getRandomBooks = async function(req, res) {
    let allBooks = await BookModel.find({ $or: [{ stockAvailable: false }, { totalPages: { $gt: 500 } }] })


    res.send({ msg: allBooks })
}

module.exports.createBook = createBook
module.exports.getBooksData = getBooksData
module.exports.getBooksInYear = getBooksInYear
module.exports.getParticularBooks = getParticularBooks
module.exports.getXINRBooks = getXINRBooks
module.exports.getRandomBooks = getRandomBooks