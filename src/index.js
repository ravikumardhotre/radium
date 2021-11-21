const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const midGlb = function(req, res, next) {
    console.log("1. hey... Global Middleware Consoled");

    next()
}

app.use(midGlb)
const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://users-open-to-all:hiPassword123@cluster0.uh35t.mongodb.net/RavikumarDhotre?retryWrites=true&w=majority", { useNewUrlParser: true })
    .then(() => console.log(' your mongodb ready to connect servers '))
    .catch(err => console.log(err))


app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});