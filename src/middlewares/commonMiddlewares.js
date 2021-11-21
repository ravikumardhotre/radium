const midware1 = function(req, res, next) {

    let DATE = new Date(new Date())
    let IP = req.ip
    let URL = req.url
    console.log("2. Date and Time: " + DATE + "\n3. IP Address: " + IP + "\n4. API Url: " + URL);
    next()
}

module.exports.midware1 = midware1