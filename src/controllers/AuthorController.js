const AuthorModel = require("../models/AuthorModel.js")

const Creatauthors = async function(req, res) {
    var authordata = req.body
    let savedData = await AuthorModel.create(authordata)
    res.send({ msg: savedData })
}


const getAuthors = async function(req, res) {
    let allAuthors = await AuthorModel.find()
    res.send({ data: allAuthors })
}

module.exports.Creatauthors = Creatauthors
module.exports.getAuthors = getAuthors