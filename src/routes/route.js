
const express = require('express');
const router = express.Router();

const cowinController = require("../controllers/cowinController")
  
// cowin API's
router.get("/cowin/states", cowinController.getStatesList)
router.get("/cowin/districts/:stateId", cowinController.getDistrictsList)
router.get("/cowin/centers", cowinController.getByPin)
router.post("/cowin/getOtp", cowinController.getOtp)
   
// Temperature API's
router.get("/city/temp", cowinController.getTemp)
router.get("/city/weather", cowinController.cityWeather)
router.get("/citytemp/temp", cowinController.allTemp)

module.exports = router;
