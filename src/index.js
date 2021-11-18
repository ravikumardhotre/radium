const express = require('express'); // imported express
var bodyParser = require('body-parser');

const route = require('./routes/route.js'); // imported route file

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose')

// this is my  connection string  to make connection with database 

mongoose.connect("mongodb+srv://user-open-to-all:hiPassword123@cluster0.xgk0k.mongodb.net/Ravikumar_Dhotre-database?retryWrites=true&w=majority", { useNewUrlParser: true })
    .then(() => console.log('Hey... your  mongodb now connected  '))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});