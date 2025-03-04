const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErr.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const {validatereview, isloggedin, isauthor} = require("../middleware.js");

const reviewcontroller = require("../controller/reviews.js");


//9route Reviews route

router.post("/", validatereview, wrapAsync(reviewcontroller.create));
    

// 10 delete review route

router.delete("/:reviewid",isloggedin,isauthor, wrapAsync(reviewcontroller.delete));


module.exports = router;