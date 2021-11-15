const bookModel = require("../models/bookModel")
    //const BookModule = require("../models/bookModel")

const creatBook = async function(req, res) {
    var data = req.body
    let savedData = await bookModel.create(data)
    res.send({ msg: savedData })

}

const getBookData = async function(req, res) {
    var allBooks = await bookModel.find()
    res.send({ msg: allBooks })
}
module.exports.creatBook = creatBook
module.exports.getBookData = getBookData