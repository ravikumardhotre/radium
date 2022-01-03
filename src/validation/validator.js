const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
    // Validation checking function

const isValid = function(value) {
    if (typeof value === 'undefined' || value === null) return false //it checks whether the value is null or undefined.
    if (typeof value === 'string' && value.trim().length === 0) return false //it checks whether the string contain only space or not 
    return true;
};
const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0; // it checks, is there any key is available or not in request body
};

const validforEnum = function(value) {
    let available = ["S", "XS", "M", "X", "L", "XXL", "XL"]
    value = value.split(",")
    for (let x of value) {
        if (available.includes(x) == false) {
            return false
        }
    }
    return true;
}

const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const reNumber = /^[0-9]{10}$/

const validateEmail = function(email) {
    return re.test(email)
};
const isValidNumber = function(phone) {
    return reNumber.test(phone)
}

const validString = function(value) {
    if (typeof value === 'string' && value.trim().length === 0) return false //it checks whether the string contain only space or not 
    return true;
}
const validforStatus = function(value) {
    if (["pending", "completed", "cancled"].indexOf(value) == -1) { return false } //mean's he have not found it
    if (["pending", "completed", "cancled"].indexOf(value) > -1) { return true } //mean's he have found it
}
const isValidLength = function(value, min, max) {
    const len = String(value).length
    return len >= min && len <= max
}

//for product
const validQuantity = function isInteger(value) {
    if (value < 1) return false
    if (isNaN(Number(value))) return false
    if (value % 1 == 0) return true
}


const validAddress = function(address) {
    if (typeof address === 'undefined' || address === null) return false //it checks whether the value is null or undefined.
    if (Object.keys(address).length === 0) return false
    return true;
}
const validInstallment = function isInteger(value) {
    return value % 1 == 0;
}


module.exports = {
    isValid,
    isValidRequestBody,
    validateEmail,
    isValidObjectId,
    validString,
    validAddress,
    validInstallment,
    isValidObjectId,
    isValidLength,
    isValidNumber,
    validforEnum,
    validforStatus,
    validQuantity
}