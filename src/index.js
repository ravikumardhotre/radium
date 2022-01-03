const express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer') // HERE
const mongoose = require('mongoose')
const route = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any()) // HERE

app.use('/', route);

mongoose.connect("mongodb+srv://users-open-to-all:hiPassword123@cluster0.uh35t.mongodb.net/Project5_RR?authSource=admin&replicaSet=atlas-wwe75z-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Beta&retryWrites=true&ssl=true", { useNewUrlParser: true })
    .then(() => console.log('MongoDb connected'))
    .catch(err => console.log(err))

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});