const express = require('express');
const router = express.Router();


const commonMiddlewares = require("../middlewares/commonMiddlewares")
const CMController = require("../controllers/CMController")

router.get('/middleware', commonMiddlewares.midware1, CMController.midware)

module.exports = router;