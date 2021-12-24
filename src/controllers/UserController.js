const userModel = require('../models/userModel')
const validator = require('../validation/validator')
const config = require('../Aws/Aws')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10


const userCreation = async(req, res) => {
    try {
        let files = req.files;
        if (files) {
            if (files && files.length > 0) {
                let uploadedFileURL = await config.uploadFile(files[0]);
                return res.status(201).send({ status: true, data: uploadedFileURL });
            } else {
                return res.status(400).send({ status: true, message: "Nothing to upload." });
            }
        }

        const requestBody = req.body;
        const { fname, lname, email, profileImage, phone, password, address } = requestBody

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "please provide valid request body" })
        }
        if (!validator.isValid(fname)) {
            return res.status(400).send({ status: false, message: "fname is required" })
        }
        if (!validator.isValid(lname)) {
            return res.status(400).send({ status: false, message: "lname is required" })
        }
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "email is required" })
        }
        const isEmailAleadyUsed = await userModel.findOne({ email })
        if (isEmailAleadyUsed) {
            return res.status(400).send({ status: false, message: "Email is already in use, try something different" })
        }
        if (!validator.isValid(profileImage)) {
            return res.status(400).send({ status: false, message: "ProfileImage link is required" })
        }
        if (!validator.isValid(phone)) {
            return res.status(400).send({ status: false, message: "phone is required" })
        }
        const isPhoneAleadyUsed = await userModel.findOne({ phone })
        if (isPhoneAleadyUsed) {
            return res.status(400).send({ status: false, message: "Phone is already in use, try something different" })
        }
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "password should be of minimum 8 and maximum 15 character" })
        }
        if (!validator.isValid(address)) {
            return res.status(400).send({ status: false, message: "address is required" })
        }
        if (address) {
            if (!address.shipping && address.billing) {
                return res.status(400).send({ status: false, message: "Address must contain both full shipping and billing address." })
            }
            if (!validator.isValid(address.shipping.street)) return res.status(400).send({ status: false, message: "Shipping address must contain complete street details." })

            if (!validator.isValid(address.shipping.city)) return res.status(400).send({ status: false, message: "Shipping address must contain city." })

            if (!validator.isValid(address.shipping.pincode)) return res.status(400).send({ status: false, message: "Shipping address must contain a valid pincode." })

            if (!validator.isValid(address.billing.street)) return res.status(400).send({ status: false, message: "Billing address must contain city." })

            if (!validator.isValid(address.billing.city)) return res.status(400).send({ status: false, message: "Billing address must contain Street, City and Pincode." })

            if (!validator.isValid(address.billing.pincode)) return res.status(400).send({ status: false, message: "Billing address must contain a valid pincode." })
        }
        const encryptedPassword = await bcrypt.hash(password, saltRounds)
        userData = {
            fname,
            lname,
            email,
            profileImage,
            phone,
            password: encryptedPassword,
            address
        }
        const saveUserData = await userModel.create(userData);
        return res
            .status(201)
            .send({
                status: true,
                message: "user created successfully.",
                data: saveUserData
            });
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: "Error is : " + err
        })
    }
}

const userLogin = async function(req, res) {
    try {
        const requestBody = req.body;
        if (!validator.isValid(requestBody.email)) {
            res.status(400).send({ status: false, message: 'email key is required' })
            return
        }
        if (!validator.isValid(requestBody.password)) {
            res.status(400).send({ status: false, message: 'password key is required' })
            return
        }
        if (!validator.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
            return
        }
        // Extract params
        const { email, password } = requestBody;
        // Validation starts
        if (!validator.isValid(email.trim())) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        if (!validator.isValid(password.trim())) {
            res.status(400).send({ status: false, message: `Password is required` })
            return
        }
        // Validation ends
        const user = await userModel.findOne({ email, password });
        if (!user) {
            res.status(401).send({ status: false, message: `Invalid login credentials` });
            return
        }
        const token = await jwt.sign({
            userId: id,
            iat: Math.floor(Date.now() / 1000), //time of issuing the token.
            exp: Math.floor(Date.now() / 1000) + 60 * 24 * 7 //setting token expiry time limit.
        }, 'group3Project5')

        res.status(200).send({ status: true, message: `user login successfull`, data: { token } });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}



//-------------------------------------------------------------------------------------------------

const getUserDetails = async function(req, res) {
    try {
        const user_Id = req.params.userId;
        const userId = req.userId;

        console.log(userId)
        if (!validator.isValidObjectId(user_Id)) {
            return res
                .status(400)
                .send({ status: false, message: `${userId} is not a valid user id` });
        }

        const user = await userModel.findById({ _id: user_Id });

        if (!user) {
            return res
                .status(404)
                .send({ status: false, message: `User does not exit` });
        }

        
        if (req.user.userId != user_Id) {
            return res
                .status(401)
                .send({
                    status: false,
                    message: `Unauthorized access! `,
                });
            return;
        }

        return res
            .status(200)
            .send({ status: true, message: "User profile details", data: user });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};








const updateUser = async function(req, res) {
    try {
        const userId = req.params.userId
        const tokenUserId = req.userId

        if (!isValidObjectId(userId) && !isValidObjectId(tokenUserId)) {
            return res.status(404).send({ status: false, message: "userId or token is not valid" })
        }
        const user = await userModel.findOne({ _id: userId })
        if (!user) {
            res.status(404).send({ status: false, message: `user not found` })
            return
        }
        if (!(userId.toString() == tokenUserId.toString())) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }

        let { fname, lname, email, phone, password, address } = req.body

        const profileImage = req.urlimage

        const filterQuery = {};
        if (isValid(fname)) {
            filterQuery['fname'] = fname.trim()
        }
        if (isValid(lname)) {
            filterQuery['lname'] = lname.trim()
        }
        if (isValid(email)) {
            const checkEmail = await userModel.find({ email: email })
            if (!(checkEmail.length == 0)) {
                return res.status(400).send({ status: false, message: `${email} is not unique` })
            }
            filterQuery['email'] = email.trim()
        }
        if (isValid(phone)) {
            const checkphone = await userModel.find({ phone: phone })
            if (!(checkphone.length == 0)) {
                return res.status(400).send({ status: false, message: `${phone} is not unique` })
            }
            filterQuery['phone'] = phone.trim()
        }
        if (isValid(password)) {
            if (password.trim().length > 7 && password.trim().length < 16) {
                const hashPassword = await aws.hashPassword(password.trim())
                filterQuery['password'] = hashPassword;
            }
        }

        if (address) {
            address = JSON.parse(address)
            if (address.shipping) {
                if ('address.shipping.street') {
                    if (!validString(address.shipping.street)) {
                        return res.status(400).send({ status: false, message: ' Please provide street' })
                    }
                    filterQuery['address.shipping.street'] = address.shipping.street
                }
                if ('address.shipping.city') {
                    if (!validString(address.shipping.city)) {
                        return res.status(400).send({ status: false, message: ' Please provide city' })
                    }
                    filterQuery['address.shipping.city'] = address.shipping.city
                }
                if ('address.shipping.pincode') {
                    if (typeof address.shipping.pincode !== 'number') {
                        return res.status(400).send({ status: false, message: ' Please provide pincode' })
                    }
                    filterQuery['address.shipping.pincode'] = address.shipping.pincode
                }
            }

            if (address.billing) {
                if ('address.billing.street') {
                    if (!validString(address.billing.street)) {
                        return res.status(400).send({ status: false, message: ' Please provide street' })
                    }
                    filterQuery['address.billing.street'] = address.billing.street
                }
                if ('address.billing.city') {
                    if (!validString(address.billing.city)) {
                        return res.status(400).send({ status: false, message: ' Please provide city' })
                    }
                    filterQuery['address.billing.city'] = address.billing.city
                }
                if ('address.billing.pincode') {
                    if (typeof address.billing.pincode !== 'number') {
                        return res.status(400).send({ status: false, message: ' Please provide pincode' })
                    }
                    filterQuery['address.billing.pincode'] = address.billing.pincode
                }
            }
        }
        filterQuery.profileImage = profileImage;
        const userdetails = await userModel.findOneAndUpdate({ userId }, filterQuery, { new: true })
        return res.status(200).send({ status: true, message: "User profile Details", data: userdetails })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = {
    userCreation,
    userLogin,
    getUserDetails,
    updateUser

}
