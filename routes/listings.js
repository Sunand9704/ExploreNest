const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErr.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listings.js");
const { deleteMany } = require("../models/review.js");
const {isloggedin} = require("../middleware.js");
const {isowner,validateListing} = require("../middleware.js");
//for cloud
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer ({storage});

const listingcontroller  = require("../controller/listings.js");

router
.route("/")
.get(wrapAsync(listingcontroller.index))
.post(isloggedin, upload.single('listing[image]'), validateListing,wrapAsync(listingcontroller.createlis));

//search route
router.get("/search",wrapAsync(listingcontroller.searching));
 

 /// 4 NEW ROUTE
 router.get("/new", isloggedin, listingcontroller.rendernewform); 

router.route("/:id")
.get( wrapAsync(listingcontroller.showlisting))
.put(isloggedin,isowner,upload.single('listing[image]'),validateListing,wrapAsync(listingcontroller.update))
.delete(isloggedin,isowner, wrapAsync(listingcontroller.delete))

//booking

router.get("/:id/book", wrapAsync(listingcontroller.booking));
router.post("/:id/book", wrapAsync(listingcontroller.booking));
router.post("/:id/booked", wrapAsync(listingcontroller.booked));
 

//6 EDIT ROUTE
router.get("/:id/edit",isloggedin,isowner,wrapAsync(listingcontroller.editform));


// const listings = [
//     ["Cozy Beachfront Cottage", 34.0259, -118.7798],
//     ["Modern Loft in Downtown", 40.7128, -74.0060],
//     ["Mountain Retreat", 39.1911, -106.8175],
//     ["Historic Villa in Tuscany", 43.7696, 11.2558],
//     ["Secluded Treehouse Getaway", 45.5051, -122.6750],
//     ["Beachfront Paradise", 21.1619, -86.8515],
//     ["Rustic Cabin by the Lake", 39.0968, -120.0324],
//     ["Luxury Penthouse with City Views", 34.0522, -118.2437],
//     ["Ski-In/Ski-Out Chalet", 46.0963, 7.2266],
//     ["Safari Lodge in the Serengeti", -2.3333, 34.8333],
//     ["Historic Canal House", 52.3676, 4.9041],
//     ["Private Island Retreat", -17.7134, 178.0650],
//     ["Charming Cottage in the Cotswolds", 51.8330, -1.8433],
//     ["Historic Brownstone in Boston", 42.3601, -71.0589],
//     ["Beachfront Bungalow in Bali", -8.4095, 115.1889],
//     ["Mountain View Cabin in Banff", 51.1784, -115.5708],
//     ["Art Deco Apartment in Miami", 25.7617, -80.1918],
//     ["Tropical Villa in Phuket", 7.8804, 98.3923],
//     ["Historic Castle in Scotland", 57.1206, -4.7107],
//     ["Desert Oasis in Dubai", 25.276987, 55.296249]
//   ];
  



module.exports = router;