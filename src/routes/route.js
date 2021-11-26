const express = require('express');
const router = express.Router();

const CryptoController = require("../controllers/CryptoController")

router.get("/assets", CryptoController.getCoins);

module.exports = router