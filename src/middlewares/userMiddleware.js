let captureInfo = function(req, res, next) {
    let acceptHeaderValue = req.headers['isfreeapp']

    if (!acceptHeaderValue) {
        res.send({ alert: "request is missing a mandatory header" })
    } else {
        if (acceptHeaderValue === "true") {
            acceptHeaderValue = true
        } else {
            acceptHeaderValue = false;
        }
        req.isFreeAppUser = acceptHeaderValue;
        next()
    }
}
module.exports.captureInfo = captureInfo