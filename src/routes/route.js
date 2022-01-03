const express = require('express');
const router = express.Router();
const User = require('../controllers/UserController')
const Product = require('../controllers/ProductController')
const cart = require('../controllers/CartController')
const order = require('../controllers/OrderController')
const middleware = require('../middleware/loginmiddle')

//User's APIs
router.post('/register', User.userCreat)
router.post('/login', User.userLogin)
router.get('/user/:userId/profile', middleware.userAuth, User.getProfile)
router.put('/user/:userId/profile', middleware.userAuth, User.editUser)

//Product's APIs
router.post('/products', Product.createProduct)
router.get('/products', Product.filterProduct)
router.get('/product/:productId', Product.productById)
router.put('/updateproducts/:productId', Product.updateProduct)
router.delete('/products/:productId', Product.deleteProduct)

// cart APIs
router.post('/users/:userId/cart', middleware.userAuth, cart.createCart)
router.put('/users/:userId/cart', middleware.userAuth, cart.updateCart)
router.get('/users/:userId/cart', middleware.userAuth, cart.getCart)
router.delete('/users/:userId/cart', middleware.userAuth, cart.deleteCart)

// order Apis


router.post('/users/:userId/orders', middleware.userAuth, order.createOrder)
router.put('/users/:userId/orders', middleware.userAuth, order.updateOrder)

module.exports = router;