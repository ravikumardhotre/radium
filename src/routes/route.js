const express = require('express');

const router = express.Router();
const productController = require('../controller/productController');
const userController = require('../controller/userController');
const userMiddlewares = require('../middlewares/userMiddleware');
const orderController = require('../controller/orderControler')

//   a POST api to create a product

router.post('/creatProduct', productController.creatProduct)

//   POST api to create a user that takes user details from the request body.
//   If the header is missing then msg is  a  header

router.post('/creatUser', userMiddlewares.captureInfo, userController.creatUser)

// POST api for order purchase that takes a userId and a productId in request body

router.post('/orders', userMiddlewares.captureInfo, orderController.creatOrder);

module.exports = router;