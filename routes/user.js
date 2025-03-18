const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { error } = require("../schema.js");
const { saveRedirectUrl } = require("../middleware.js");
const { isloggedin} = require("../middleware.js");


const usercontroller = require("../controller/users.js");

router.route("/signup")
.get(usercontroller.signup)
.post(wrapAsync(usercontroller.signups));

router.route("/login")
.get(usercontroller.loginform)
.post(saveRedirectUrl ,passport.authenticate("local", {failureRedirect:"/login",failureFlash:true}), usercontroller.login);


router.get("/logout",usercontroller.logout);
router.get("/dashboard", wrapAsync(usercontroller.dashboard));
router.get("/bookings", wrapAsync(usercontroller.bookings));
router.get("/profile", wrapAsync(usercontroller.profile));


router.get("/favorites/:placeid", isloggedin, wrapAsync(usercontroller.favorites));
router.get("/myfavorites", wrapAsync(usercontroller.myfavorites));

router.delete("/favorites/remove/:id", wrapAsync(usercontroller.favdel));

module.exports = router;