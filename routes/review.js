const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor} =require("../middleware.js"); 
const reviewController = require("../controller/review.js");
//Post Route
router.post("/", isLoggedIn,validateReview,wrapAsync(reviewController.postReview));
//delete review route
router.delete("/:reviewId", isReviewAuthor,wrapAsync(reviewController.deleteReview));
module.exports = router;