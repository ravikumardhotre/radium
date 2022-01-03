 const productModel = require('../models/productModel')
 const validator = require('../validation/validator')
 const config = require('../Aws/Aws')

 //----------------------------Create Product from  requestbody-------------------------------------------------------------------------- 

 const createProduct = async function(req, res) {
     try {
         let files = req.files;
         let requestBody = req.body;
         let productImage;


         let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = requestBody

         if (!validator.isValidRequestBody(requestBody)) {
             return res.status(400).send({ status: false, message: "Please provide valid request body" })
         }

         if (!validator.isValid(title)) {
             return res.status(400).send({ status: false, message: "Title is required" })
         }
         const istitle = await productModel.findOne({ title })
         if (istitle) {
             return res.status(400).send({
                 status: false,
                 message: `${title} is alraedy in use. Please use another title.`
             })
         }

         if (files) {
             if (validator.isValidRequestBody(files)) {
                 if (!(files && files.length > 0)) {
                     return res.status(400).send({ status: false, message: "Please provide product image" })
                 }
                 productImage = await config.uploadFile(files[0])
             }
         }

         if (!validator.isValid(price) || !validator.isValid(title) || !validator.isValid(currencyId) || !validator.isValid(currencyFormat) || !validator.isValid(description)) {
             return res.status(400).send({ status: false, message: "missing fields from this - ( title,Price,description or currencyId,currencyFormat )" })
         }

         if (currencyId != "INR") {
             return res.status(400).send({ status: false, message: "currencyId should be INR" })
         }

         if (style) {
             if (!validator.validString(style)) {
                 return res.status(400).send({ status: false, message: "style is required" })
             }
         }

         if (installments) {
             if (!validator.isValid(installments) || !validator.validInstallment(installments)) {
                 return res.status(400).send({ status: false, message: "installments required" }) //Doubt wheater this validation is required or not...
             }
         }

         if (isFreeShipping) {
             if (!(isFreeShipping != true)) {
                 return res.status(400).send({ status: false, message: "isFreeShipping must be a boolean value" })
             }
         }

         productImage = await config.uploadFile(files[0]);

         const updateProduct = {
             title,
             description,
             price,
             currencyId,
             currencyFormat: currencyFormat,
             isFreeShipping,
             style,
             availableSizes,
             installments,
             productImage: productImage
         }
         if (availableSizes) {
             let array = availableSizes.split(",").map(x => x.trim())
             let available = ["S", "XS", "M", "X", "L", "XXL", "XL"]
             for (let i = 0; i < array.length; i++) {
                 if (!(available.includes(array[i]))) {
                     return res.status(400).send({ status: false, message: `availableSizes should  ${["S", "XS", "M", "X", "L", "XXL", "XL"].join(', ')}` })
                 }
             }
             if (Array.isArray(array)) {
                 updateProduct['availableSizes'] = array
             }
         }
         const newProduct = await productModel.create(updateProduct)
         return res.status(201).send({ status: true, message: "Successfully saved product details", data: newProduct })

     } catch (err) {
         return res.status(500).send({
             status: false,
             message: "Error is : " + err
         })
     }
 }


 //---------------------------- get filterProduct ------------------------------------------------------------

 const filterProduct = async function(req, res) {
     try {
         const queryParams = req.query
         if (!validator.isValidRequestBody(queryParams)) {
             return res.status(400).send({ status: false, message: 'Please provide products valid query details' })
         }
         let { size, name, priceGreaterThan, priceLessThan, priceSort } = req.query
         let query = { isDeleted: false };
         if (validator.isValid(size)) {
             if (!validator.validforEnum(size)) {
                 return res.status(400).send({ status: false, message: ' Please provide valid size exist in enum values' })
             } else {
                 query['availableSizes'] = size
             }
         }
         if (validator.isValid(name)) {
             query['title'] = { $regex: name.trim() }
         }
         if (validator.isValid(priceGreaterThan)) {
             if (!(typeof priceGreaterThan !== Number)) {
                 return res.status(400).send({ status: false, message: `priceGreaterThan should be a valid number` })
             }
             if (priceGreaterThan <= 0) {
                 return res.status(400).send({ status: false, message: `priceGreaterThan should be a valid number` })
             }
             if ((!typeof(query), 'price'))
                 query['price'] = {}
             query['price']['$gte'] = Number(priceGreaterThan)
                 //console.log(typeof Number(priceGreaterThan))
         }
         if (validator.isValid(priceLessThan)) {
             if (!(!isNaN(Number(priceLessThan)))) {
                 return res.status(400).send({ status: false, message: `priceLessThan should be a valid number` })
             }
             if (priceLessThan <= 0) {
                 return res.status(400).send({ status: false, message: `priceLessThan should be a valid number` })
             }
             if (!Object.prototype.hasOwnProperty.call(query, 'price'))
                 query['price'] = {}
             query['price']['$lte'] = Number(priceLessThan)

         }

         if (priceSort) {
             if (!(priceSort == -1 || priceSort == 1)) {
                 return res.status(400).send({ status: false, message: ' Please provide priceSort value 1 ||-1' })
             }
         }

         let productsOfQuery = await productModel.find(query).sort({ price: priceSort })
         if (Array.isArray(productsOfQuery) && productsOfQuery.length === 0) {
             return res.status(404).send({ status: false, message: 'No products found' })
         }
         return res.status(200).send({ status: true, message: 'product list', data: productsOfQuery })
     } catch (error) {
         res.status(500).send({ status: false, message: error.message })
     }
 }

 //-- -- -- -- -- -- -- -- -- -- -- -- -- --get PRODUCT By productId-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

 const productById = async function(req, res) {
     try {
         let requestProductId = req.params.productId

         if (!validator.isValidObjectId(requestProductId)) {
             return res.status(400).send({ status: false, message: `${requestProductId} is not a valid product id` })
         }

         let productData = await productModel.findOne({ _id: requestProductId, isDeleted: false })
         if (!productData) {
             return res.status(404).send({ status: false, msg: 'product not found for the requested productId' })
         } else {
             return res.status(200).send({ status: true, message: " requested Product list", data: productData })
         }
     } catch (error) {
         res.status(500).send({ status: false, message: error.message })
     }
 }

 //----------------------------Update PRODUCT By productId------------------------------------------------------------


 const updateProduct = async function(req, res) {
     try {
         const requestBody = req.body
         const params = req.params
         const productId = params.productId

         // Validation stats
         if (!validator.isValidObjectId(productId)) {
             return res.status(400).send({ status: false, message: `${productId} is not a valid product id` })
         }

         const product = await productModel.findOne({ _id: productId, isDeleted: false })

         if (!product) {
             return res.status(404).send({ status: false, message: `product not found` })
         }

         if (!(validator.isValidRequestBody(requestBody) || req.files)) {
             return res.status(400).send({ status: false, message: 'No paramateres passed in req body or files ' })
         }

         // Extract params
         const { title, description, price, currencyId, isFreeShipping, style, availableSizes, installments } = requestBody;

         const newProduct = {}

         if (validator.isValid(title)) {

             const isTitleAlreadyUsed = await productModel.findOne({ title, _id: { $ne: productId } });

             if (isTitleAlreadyUsed) {
                 return res.status(400).send({ status: false, message: `${title} title is already used` })
             }

             if (!(('title') in newProduct))
                 newProduct['title'] = title
         }

         if (validator.isValid(description)) {
             if (!(('description') in newProduct))
                 newProduct['description'] = description
         }

         if (validator.isValid(price)) {

             if (!(!isNaN(Number(price)))) {
                 return res.status(400).send({ status: false, message: `Price should be a valid number` })
             }

             if (price <= 0) {
                 return res.status(400).send({ status: false, message: `Price should be a valid number` })
             }

             if (!(('price') in newProduct))
                 newProduct['price'] = price
         }

         if (validator.isValid(currencyId)) {

             if (!(currencyId == "INR")) {
                 return res.status(400).send({ status: false, message: 'currencyId should be a INR' })
             }

             if (!(('currencyId') in newProduct))
                 newProduct['currencyId'] = currencyId;
         }

         if (validator.isValid(isFreeShipping)) {

             if (!((isFreeShipping === "true") || (isFreeShipping === "false"))) {
                 return res.status(400).send({ status: false, message: 'isFreeShipping should be a boolean value' })
             }

             if (!(('isFreeShipping') in newProduct))
                 newProduct['isFreeShipping'] = isFreeShipping
         }

         let productImage = req.files;
         if ((productImage && productImage.length > 0)) {

             let newImage = await config.uploadFile(productImage[0]);

             if (!(('productImage') in newProduct))
                 newProduct['productImage'] = newImage
         }

         if (validator.isValid(style)) {

             if (!(('style') in newProduct))
                 newProduct['style'] = style
         }

         if (availableSizes) {
             let sizesArray = availableSizes.split(",").map(x => x.trim())

             for (let i = 0; i < sizesArray.length; i++) {
                 if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(sizesArray[i]))) {
                     return res.status(400).send({ status: false, message: `availableSizes should ${["S", "XS", "M", "X", "L", "XXL", "XL"].join(', ')}` })
                 }
             }
             if (!(('addToSet') in newProduct))
                 newProduct['$addToSet'] = {}
             newProduct['$addToSet']['availableSizes'] = { $each: sizesArray }
         }

         if (validator.isValid(installments)) {

             if (!(!isNaN(Number(installments)))) {
                 return res.status(400).send({ status: false, message: `installments should be a valid number` })
             }

             if (!(('installments') in newProduct))
                 newProduct['installments'] = installments
         }

         const updatedProduct = await productModel.findOneAndUpdate({ _id: productId }, newProduct, { new: true })

         return res.status(200).send({ status: true, message: 'Successfully updated product details.', data: updatedProduct });
     } catch (err) {
         return res.status(500).send({
             status: false,
             message: "Error is : " + err
         })
     }
 }

 //----------------------------delete  PRODUCT By productId------------------------------------------------------------
 const deleteProduct = async function(req, res) {
     try {
         const productId = req.params.productId
             //const userIdFromToken = req.userId
             //let filter = { isDeleted: false }

         if (!(validator.isValid(productId) && validator.isValidObjectId(productId))) {
             return res.status(400).send({ status: false, msg: "productId is not valid" })
         }
         const product = await productModel.findOne({ _id: productId })
         if (!product) {
             res.status(404).send({ status: false, message: `id don't exist in products collection` })
             return
         }

         let isProduct = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false, deletedAt: null }, { isDeleted: true, deletedAt: new Date() }, { new: true })
         if (!isProduct) {
             res.status(404).send({ status: false, msg: "the product is already deleted " })
             return
         }
         res.status(200).send({
             status: true,
             msg: "product has been deleted"
         })
     } catch (error) {
         res.status(500).send({ status: false, msg: error.message })
     }
 };



 module.exports = { createProduct, filterProduct, productById, deleteProduct, updateProduct }