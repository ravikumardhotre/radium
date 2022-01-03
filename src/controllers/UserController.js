const userModel = require('../models/userModel')
const validator = require('../validation/validator')
const config = require('../Aws/Aws')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10

const userCreat = async(req, res) => {
    try {
        let files = req.files;
        let requestBody = req.body;
        let { fname, lname, email, profileImage, phone, password, address } = requestBody

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "please provide valid request body" })
        }
        if (!validator.isValid(fname) || !validator.isValid(lname)) {
            return res.status(400).send({ status: false, message: "first name or last name is missing" })
        }

        if (!validator.validateEmail(email) || !validator.isValid(email)) {
            return res.status(400).send({ status: false, message: `something went wrong. Please enter a valid email address` })
        }
        let isEmail = await userModel.findOne({ email: requestBody.email })

        if (isEmail) {
            return res.status(400).send({ status: false, message: `Email Already Present` });
        }

        if (!validator.isValidRequestBody(files)) {
            return res.status(400).send({ status: false, message: "Profile Image is required" })
        }
        if (!(phone)) {
            return res.status(400).send({ status: false, message: "phone number is required" })
        }
        if (phone) {
            if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
                return res.status(400).send({ status: false, message: ` something went wrong. Please enter a valid Indian phone number.` });
            }
            let isPhone = await userModel.findOne({ phone: phone })
            if (isPhone) {
                return res.status(400).send({ status: false, message: ` ${phone} already registered.` });
            }
        }

        if (!validator.isValidLength(password, 8, 15) || !validator.isValid(password)) {
            return res.status(400).send({ status: false, message: `something went wrong or provided Password not  between 8 to 15 char long` })
        }

        if (!validator.isValid(address) || !validator.isValid(address.shipping) || !validator.isValid(address.shipping.street) || !validator.isValid(address.shipping.city) || !validator.isValid(address.shipping.pincode)) {
            return res.status(400).send({ status: false, message: 'please provid valid shipping address ' })
        }
        if (!validator.isValid(address) || !validator.isValid(address.billing) || !validator.isValid(address.billing.street) || !validator.isValid(address.billing.city) || !validator.isValid(address.billing.pincode)) {
            return res.status(400).send({ status: false, message: 'please provid valid billing address ' })
        }

        profileImage = await config.uploadFile(files[0]);
        const encryptPass = await bcrypt.hash(password, 10)
        userData = {
            fname,
            lname,
            email,
            profileImage,
            phone,
            password: encryptPass,
            address
        }
        const User = await userModel.create(userData);
        return res
            .status(201)
            .send({
                status: true,
                message: "user created successfully.",
                data: User
            });
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: "Error is : " + err
        })
    }
}


//-----------------------------------------login--------------------------------------------------------------->

const userLogin = async function(req, res) {
    try {
        const requestBody = req.body;

        const { email, password } = requestBody;

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
        }
        if (!validator.isValid(requestBody.email.trim()) || !validator.validateEmail(email)) {
            return res.status(400).send({ status: false, message: 'Please provide a valid email address' })
        }
        if (!validator.isValid(requestBody.password)) {
            return res.status(400).send({ status: false, message: 'Password is required' })
        }
        // Validation ends
        const user = await userModel.findOne({ email });
        const encryptPass = await bcrypt.compare(password, user.password)
        if (!user || !encryptPass) {
            return res.status(401).send({ status: false, message: `Invalid login credentials` });
        }
        const userId = user._id
        const token = await jwt.sign({
            userId: userId,
            iat: Math.floor(Date.now() / 1000), //time of issuing the token.
            exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7 //setting token expiry time limit.
        }, 'group3Project5')
        return res.status(200).send({
            status: true,
            message: `user login successfull `,
            data: {
                userId,
                token
            }
        })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}


const getProfile = async(req, res) => {
        try {
            const userId = req.params.userId
            const userIdToken = req.userId
                //validation starts
            if (!validator.isValidObjectId(userId)) {
                return res.status(400).send({ status: false, message: "Invalid userId in params." })
            }
            //validation ends
            const isUser = await userModel.findOne({ _id: userId })
            if (!isUser) {
                return res.status(400).send({
                    status: false,
                    message: `User doesn't exists by ${userId}`
                })
            }
            //Checking the authorization of the user -> Whether user's Id matches with the book creater's Id or not.
            if (userIdToken != isUser._id) {
                return res.status(403).send({
                    status: false,
                    message: "Unauthorized access."
                })
            }
            return res.status(200).send({ status: true, message: "Profile found successfully.", data: isUser })
        } catch (err) {
            return res.status(500).send({
                status: false,
                message: "Error is: " + err.message
            })
        }
    }
    //-------------------------------------Update user's details ----------------------------------------------------------------->

const editUser = async(req, res) => {
    try {
        let files = req.files
        let requestBody = req.body
        let userId = req.params.userId
        let userIdToken = req.userId

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
        }
        if (!validator.isValidObjectId(userIdToken)) {
            return res.status(400).send({ status: false, message: `Unauthorized access! User's info doesn't match ` })
        }
        const isUser = await userModel.findOne({ _id: userId })
        if (!isUser) {
            return res.status(400).send({
                status: false,
                message: `User doesn't exists by ${userId}`
            })
        }
        if (isUser._id.toString() != userIdToken) {
            res.status(401).send({ status: false, message: `Unauthorized access! User's info doesn't match` });
            return
        }
        // Extract params
        let { fname, lname, email, phone, password, address, profileImage } = requestBody;

        if (!validator.validString(fname) || !validator.validString(lname)) {
            return res.status(400).send({ status: false, message: 'first name or last name is Required' })
        }
        if (!validator.validString(email) || !validator.validateEmail(email)) {
            return res.status(400).send({ status: false, message: 'Please provide a valid email address' })
        }
        let isEmail = await userModel.findOne({ email: email })
        if (isEmail) {
            return res.status(400).send({ status: false, message: ` ${email} already registered, try onother` });
        }
        if (files) {
            if (validator.isValidRequestBody(files)) {
                if (!(files && files.length > 0)) {
                    return res.status(400).send({ status: false, message: " please provide profile image" })
                }
                var newImage = await config.uploadFile(files[0])
            }
        }
        if (!validator.validString(phone)) {
            return res.status(400).send({ status: false, message: 'phone number is Required' })
        }
        if (phone) {
            if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
                return res.status(400).send({ status: false, message: `Please enter a valid Indian phone number.` });
            }
            let isPhone = await userModel.findOne({ phone: phone })
            if (isPhone) {
                return res.status(400).send({ status: false, message: ` ${phone} already registered.` });
            }
        }
        if (!validator.validString(password)) {
            return res.status(400).send({ status: false, message: 'password is Required' })
        }
        if (password) {
            if (!(password.length >= 8 && password.length <= 15)) {
                return res.status(400).send({ status: false, message: "Password should be Valid min 8 and max 15 " })
            }
            var encryptPass = await bcrypt.hash(password, saltRounds)
        }

        if (address) {
            let shipping = JSON.stringify(address)
            let ShippingAdd = JSON.parse(shipping)

            if (validator.isValidRequestBody(ShippingAdd)) {

                if (('shipping') in ShippingAdd) {

                    if (('street') in ShippingAdd.shipping) {
                        var shippingStreet = address.shipping.street
                        if (!validator.isValid(ShippingAdd.shipping.street)) {
                            return res.status(400).send({ status: false, message: "  Please provide shipping  Street" });
                        }
                    }
                    if (('city') in ShippingAdd.shipping) {
                        var shippingCity = address.shipping.city
                        if (!validator.isValid(ShippingAdd.shipping.city)) {
                            return res.status(400).send({ status: false, message: " Please provide shipping  City" });
                        }
                    }
                    if (('pincode') in ShippingAdd.shipping) {
                        var shippingPincode = address.shipping.pincode
                        if (!validator.isValid(ShippingAdd.shipping.pincode)) {
                            return res.status(400).send({ status: false, message: "  Please provide shipping pincode" });
                        }
                    }
                }
            } else {
                return res.status(400).send({ status: false, message: " Invalid request parameters. Shipping address cannot be empty" });
            }
        }
        if (address) {
            let billing = JSON.stringify(address)
            let billingAdd = JSON.parse(billing)

            if (validator.isValidRequestBody(billingAdd)) {
                if (('billing') in billingAdd) {
                    if (('street') in billingAdd.billing) {
                        var billingStreet = address.billing.street
                        if (!validator.isValid(billingAdd.billing.street)) {
                            return res.status(400).send({ status: false, message: "Please provide billing  Street" });
                        }
                    }
                    if (('city') in billingAdd.billing) {
                        var billingCity = address.billing.city
                        if (!validator.isValid(billingAdd.billing.city)) {
                            return res.status(400).send({ status: false, message: "  Please provide billing  City" });
                        }
                    }
                    if (('pincode') in billingAdd.billing) {
                        var billingPincode = address.billing.pincode
                        if (!validator.isValid(billingAdd.billing.pincode)) {
                            return res.status(400).send({ status: false, message: "  Please provide billing  pincode" });
                        }
                    }
                }
            } else {
                return res.status(400).send({ status: false, message: "  Billing address cannot be empty" });
            }
        }

        //Validation ends

        let editUser = await userModel.findOneAndUpdate({ _id: userId }, {
            $set: {
                fname: fname,
                lname: lname,
                email: email,
                profileImage: newImage,
                phone: phone,
                password: encryptPass,
                'address.shipping.street': shippingStreet,
                'address.shipping.city': shippingCity,
                'address.shipping.pincode': shippingPincode,
                'address.billing.street': billingStreet,
                'address.billing.city': billingCity,
                'address.billing.pincode': billingPincode
            }
        }, { new: true })
        return res.status(200).send({ status: true, data: editUser })
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

module.exports = {
    userCreat,
    userLogin,
    getProfile,
    editUser
}