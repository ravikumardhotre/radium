const axios = require("axios");


// get all states list
const getStatesList = async function(req, res) {
    try {
        let options = {
            method: "get",
            url: "https://cdn-api.co-vin.in/api/v2/admin/location/states",
        };
        const cowinStates = await axios(options);

        console.log("WORKING");
        let states = cowinStates.data;
        res.status(200).send({ msg: "Successfully fetched data", data: states });

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "Something Went Wrong!!!!!" });
    }

};
// get All Districts list

const getDistrictsList = async function(req, res) {

    try {
        let id = req.params.stateId
        console.log(" state: ", id)

        let options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}` //plz take 5 mins to revise template literals here
        }
        let response = await axios(options)

        let districts = response.data

        console.log(response.data)
        res.status(200).send({ msg: "Success", data: districts })

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ msg: "Something Went Wrong!!!!!" })
    }
}

// get centers details by pincode
const getByPin = async function(req, res) {

    try {

        let pin = req.query.pincode
        let date = req.query.date

        let options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin}&date=${date}`
        }
        let response = await axios(options)



        let centers = response.data
        console.log(centers)
        res.status(200).send({ msg: "Success", data: centers })

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ msg: "Something went wrong" })
    }
}

// get otp by number to login
const getOtp = async function(req, res) {

    try {

        let options = {
            method: "post",
            url: `https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP`,
            data: { "mobile": req.body.mobile }
        }
        let response = await axios(options)
        console.log(response)
        let id = response.data
        res.status(200).send({ msg: "Success", data: id })

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ msg: "Something Went Wrong!!!!" })
    }
}

//Get tthe Weathers details By Axios 




const cityWeather = async function(req, res) {
    try {
        let city = req.query.q;
        let key = req.query.appid

        let options = {
            method: "get",
            url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`,
        };
        const weatherdata = await axios(options);

        console.log(weatherdata)
            // let london = weatherdata;
        res.status(200).send({ msg: "Weathers Details", data: weatherdata.data });

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "Something Went Wrong", err });
    }

};

// get only temp

const getTemp = async function(req, res) {
    try {
        let city = req.query.q;
        let key = req.query.appid

        let temp = {
            method: "get",
            url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`,
        };
        let weatherdata = await axios(temp);

        let tempDetails = parseInt(weatherdata.data.main.temp)

        res.status(200).send({
            msg: "Temperature Details",
            temp: tempDetails + " k",
            temp: (tempDetails - 272) + " °C"
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "Something Went Wrong", err });
    }

};


// Sort the cities  ["Bengaluru","Mumbai", "Delhi", "Kolkata", "Chennai", "Latur", "Moscow"] in order of their increasing temperature

const allTemp = async function(req, res) {
    try {
        let cities = ["Bengaluru", "Mumbai", "Delhi", "Kolkata", "Chennai", "Latur", "Moscow"]
        let cityTemp = []
        for (let i = 0; i < cities.length; i++) {
            cityArray = { city: cities[i] }
            let response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=501c4da9141bac955a83bc7512e6bdfd`);
            cityArray.temp = response.data.main.temp
            cityTemp.push(cityArray)
        }
        let sortTemp = cityTemp.sort(function(a, b) { return a.temp - b.temp })
        res.status(200).send({ msg: "Successfully get temperature", temperature: sortTemp })
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "Something Went Wrong!!!!", err });
    }


}


module.exports.getStatesList = getStatesList;
module.exports.getDistrictsList = getDistrictsList;
module.exports.getByPin = getByPin;
module.exports.getOtp = getOtp;

module.exports.cityWeather = cityWeather;
module.exports.allTemp = allTemp;
module.exports.getTemp = getTemp