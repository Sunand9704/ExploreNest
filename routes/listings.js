const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErr.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listings.js");
const { deleteMany } = require("../models/review.js");
const {isloggedin} = require("../middleware.js");
const {isowner,validateListing} = require("../middleware.js");

const listingcontroller  = require("../controller/listings.js");

router
.route("/")
.get(wrapAsync(listingcontroller.index))
.post(isloggedin, validateListing, wrapAsync(listingcontroller.createlis));
 

 /// 4 NEW ROUTE
 router.get("/new", isloggedin, listingcontroller.rendernewform); 

router.route("/:id")
.get( wrapAsync(listingcontroller.showlisting))
.put(isloggedin,isowner,wrapAsync(listingcontroller.update))
.delete(isloggedin,isowner, wrapAsync(listingcontroller.delete));

 
 

//6 EDIT ROUTE
router.get("/:id/edit",isloggedin,isowner,wrapAsync(listingcontroller.editform));




module.exports = router;