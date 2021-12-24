const jwt = require('jsonwebtoken')

const userAuth = async(req, res, next) => {
    try {
        const token = req.headers['authorization']
        console.log("token is generated-->", token)
        if (!token) {
            res.status(403).send({ status: false, message: `Missing authentication token in request` })
        } else {
            const decoded = await jwt.verify(token && token.split(' ')[1], 'group5')
            if (decoded) {
                console.log(decoded)
                req.userId = decoded.userId
                console.log(req.userId)
                next()
            }
        }
    } catch (error) {
        console.error(`Error! ${error.message}`)
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = userAuth
