const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { error } = require("../schema.js");
const { saveRedirectUrl } = require("../middleware.js");

const usercontroller = require("../controller/users.js");

router.route("/signup")
.get(usercontroller.signup)
.post(wrapAsync(usercontroller.signups));

router.route("/login")
.get(usercontroller.loginform)
.post(saveRedirectUrl ,passport.authenticate("local", {failureRedirect:"/login",failureFlash:true}), usercontroller.login);


router.get("/logout",usercontroller.logout);


module.exports = router;