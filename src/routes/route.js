const express = require('express');

const router = express.Router();

router.get('/test-me', function(req, res) {
    res.send('My first ever api!')
});


router.get('/colors', function(req, res) {
    res.send('My second api for colors path')
});

// task 1-->
//  Create an endpoint
// for GET / movies that returns a list of movies.
// Define an array of movies in your code and
// return the value in response.

router.get('/movies', function(req, res) {
    const moviesName = ["sholay", "shershah", "loveAajKal", "kabir Singh"]
    res.send(moviesName)
});

//  task2---> 
//Create an endpoint GET / movies / indexNumber(For example GET / movies / 2 is a valid request and it should
// return the movie in your array at index 2)

router.get('/movies/:moviesIndex', function(req, res) {
    let Movies = ["sholay", "shershah", "loveAajKal", "kabir Singh"]
    let index = req.params.moviesIndex
    let moviesIndexAt = Movies[index]

    // res.send(moviesIndexAt) ? res.send("enter valid index") : res.send(Movies[value])
    // Handle a scenario where
    // if the index is greater
    // than the valid maximum value
    // a message is returned that tells the user to use a valid index

    if (index <= Movies.length - 1) {
        res.send(moviesIndexAt)
    } else {
        res.send("please enter the valid index")
    }
});
// 3. Write another api called GET / films.Instead of an array of strings
// define an array of movie objects this time.
// Each movie object should have values - id, name.

router.get('/films', function(req, res) {
    const FilmsName = [{ "id": 1, "name": "The Shining" }, {
        "id": 2,
        "name": "Incendies "
    }, {
        "id": 3,
        "name": "Rang de Basanti"
    }, { "id": 4, "name": "Finding Demo" }]
    res.send(FilmsName)


});

// 4. Write api GET / films /: filmId where filmId is the value received in request path params.Use this value to
// return a films object
// with this id.In
// case there is no such movie present
// return a suitable
// message in the response body.






router.get('/films/:index', function(req, res) {
    let array = [{
        id: 1,
        name: "The Shining"
    }, {
        id: 2,
        name: "Incendies"
    }, {
        id: 3,
        name: "Rang de Basanti"
    }, {
        id: 4,
        name: "Finding Demo"
    }]
    const value = req.params.index
    let no = 0
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == value) {
            res.send(array[i])
            no = 1
            break
        }
    }
    if (no == 0)
        res.send("invalid no")
});





module.exports = router;