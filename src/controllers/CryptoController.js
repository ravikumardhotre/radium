const axios = require("axios");
const Coinsmodel = require('../Model/Coinsmodel')



const getCoins = async function(req, res) {

    try {
        let coinsDetails = {
            method: "get",
            url: 'http://api.coincap.io/v2/assets'
        }
        let getDetails = await axios(coinsDetails)

        let Array = getDetails.data
        let newArray = Array.data
        for (i in newArray) {
            let coinData = {
                Symbol: newArray[i].Symbol,
                name: newArray[i].name,
                marketCapUsd: newArray[i].marketCapUsd,
                priceUsd: newArray[i].priceUsd
            }
            await Coinsmodel.create(coinData)
        }

        newArray.sort(function(a, b) {
            return (a.changePercent24Hr) - (b.changePercent24Hr)
        })
        res.status(200).send({ status: true, Data: dataArray })

    } catch (err) {
        res.status(500).send({ message: "something went wrong!!", Error: err.message })
    }
}

module.exports.getCoins = getCoins