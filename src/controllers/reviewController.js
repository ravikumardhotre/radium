const validate = require("../validation/validator")
const bookModel = require("../models/bookModel")
const reviewModel = require('../models/reviewModel')

//---------------------------------------------------------------------------------------

// 1---> To Create the reveiw
const createReview = async function(req, res) {
        try {
            const requestBody = req.body;
            const bookId = req.params.bookId
            if (!validate.isValidRequestBody(requestBody)) {
                res.status(400).send({ status: false, message: 'Invalid parameters!!. Please provide review details' })
                return
            }
            const { reviewedBy, review, rating } = requestBody;
            if (!validate.isValidObjectId(bookId)) {
                res.status(400).send({ status: false, message: ' please provide valid bookId ' })
                return
            }

            if (!validate.isValid(rating)) {
                res.status(400).send({ status: false, message: ' Please provide a valid rating' })
                return
            }

            if (!validate.validateRating(rating)) {
                //if(!(/^.{1,5}$/.test(rating))){
                res.status(400).send({ status: false, message: 'rating should be between 1 to 5 integers' })
                return
            }
            if (!validate.isValid(review)) {
                res.status(400).send({ status: false, message: ' Please provide a review' })
                return
            }
            const book = await bookModel.findOne({ _id: bookId, isDeleted: false, deletedAt: null });
            if (!book) {
                res.status(400).send({ status: false, message: `bookId does not exists` })
                return
            }

            const reviewData = {
                bookId: bookId,
                reviewedBy: reviewedBy ? reviewedBy : "Guest",
                reviewedAt: new Date(),
                rating: rating,
                review: review

            }
            const newReview = await reviewModel.create(reviewData)

            if (newReview) {

                const updateBook = await reviewModel.find({ bookId: bookId, isDeleted: false });
                let reviewLength = updateBook.length
                console.log(reviewLength)
                const updateBook1 = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { reviews: reviewLength })

                res.status(201).send({ status: true, message: 'review added successfully for this bookId', data: newReview })
            }


        } catch (error) {
            console.log(error)
            res.status(500).send({ status: false, message: error.message });
        }
    }
    //---------------------------------------------------------------------------------------

// 1---> To updatee  reveiw
const updateReview = async function(req, res) {
    try {
        const requestBody = req.body
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId
        if (!validate.isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: `${bookId}is​​​not a valid bookId id` })
            return
        }
        if (!validate.isValidObjectId(reviewId)) {
            res.status(400).send({ status: false, message: `${reviewId}​​​​​​is not a valid reviewId id` })
            return
        }
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            res.status(400).send({ status: false, message: `book does not exists` })
            return
        }
        const fetchReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!fetchReview) {
            res.status(400).send({ status: false, message: `Review does not exists` })
            return
        }

        const { reviewedBy, review, rating } = requestBody;

        if (!validate.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Please provide paramateres to update perticular review' })
            return
        }

        updatedReviewData = {}

        if (validate.isValid(reviewedBy)) {
            updatedReviewData['reviewedBy'] = reviewedBy.trim()
        }
        //  else {
        //     updatedReviewData['reviewedBy'] = "Guest"
        // }
        if (validate.isValid(rating)) {
            // rating  validation pending
            if (!validate.validateRating(rating)) {
                //if(!(/^.{1,5}$/.test(rating))){
                res.status(400).send({ status: false, message: 'rating should be between 1 to 5 integers' })
                return
            } else {
                updatedReviewData['rating'] = rating
            }
        }

        if (validate.isValid(review)) {
            updatedReviewData['review'] = review
        }

        const updateReview = await reviewModel.findOneAndUpdate(fetchReview, updatedReviewData, { new: true })
            //console.log(updateReview)
        const { title, excerpt, userId, category, subcategory, reviews, releasedAt, isDeleted, deletedAt } = book
        const responseData = {
            title: title,
            excerpt: excerpt,
            userId: userId,
            category: category,
            subcategory: subcategory,
            review: reviews,
            releasedAt: releasedAt,
            isDeleted: isDeleted,
            deletedAt: deletedAt
        }
        responseData['reviewsData'] = updateReview

        res.status(200).send({ status: true, message: 'review updated successfully', data: responseData });

    } catch (e) {
        res.status(500).send({ status: false, message: e.message })
    }
}

//---------------------------------------------------------------------------------------
// to delete the review 

const deleteReview = async function(req, res) {
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        if (!(validate.isValid(bookId) && validate.isValid(reviewId))) {
            return res.status(400).send({ status: false, msg: "params Id is not valid" })
        }

        const review = await reviewModel.findOne({ _id: reviewId, bookId: bookId })

        if (!review) {
            res.status(404).send({ status: false, message: ` review not found` })
            return
        }
        let deleteReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false, deletedAt: null }, { isDeleted: true, deletedAt: new Date() }, { new: true })

        if (!deleteReview) {
            res.status(404).send({ status: false, msg: "review is alredy deleted" })
            return
        } else {
            const updateBook = await reviewModel.find({ bookId: bookId, isDeleted: false });
            let reviewLength = updateBook.length
                // console.log(reviewLength)
            const updateBook1 = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { reviews: reviewLength })
            res.status(200).send({ status: true, msg: "Review has been deleted successfully" })
        }

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
};



module.exports = { createReview, updateReview, deleteReview }