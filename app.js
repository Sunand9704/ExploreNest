
if(process.env.NODE_ENV != "production")
{
    require('dotenv').config();
}




const express = require("express");
const app=express();
const port = 4000;
const path = require("path");
const ExpressError = require("./utils/ExpressErr.js");
const ejsmate = require("ejs-mate");
const mongoose=require("mongoose");
const methodoverride = require("method-override");
const { captureRejectionSymbol } = require("events");
const { log, error } = require("console");
app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

//from router
const listings = require("./routes/listings.js");
const user = require("./routes/user.js");
const reviewRoutes = require("./routes/review.js");
//sessions
const sessions = require("express-session");
const { max } = require("./schema.js");
const flash = require("connect-flash");
const passport = require("passport");
const Localstratergy = require("passport-local");
const User = require("./models/user.js");

main().then(() => 
    {
       console.log("connected to database")
    })
    .catch(err => console.log(err));
    
    async function main() {
      await mongoose.connect('mongodb://127.0.0.1:27017/ExploreNest');
    }

    // 1
//1


const sessionopt=
{
    secret:"mysupersectercode",
    resave:false,
    saveUninitialized :true,
    Cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge : 7 * 24 * 60 * 60 *1000,
        httpOnly : true,
    },
};

app.get("/", (req,res) =>{
    res.redirect("/listings");
});

app.use(sessions(sessionopt));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>
{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currenuser = req.user;
    next();
});


app.use("/listings" , listings);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", user);


app.all("*", (req,res,next) =>
{
    next(new ExpressError(404, "page Not Found"));
});


app.use((err, req,res, next) =>{
    let {statusCode=500, message="something Went wrong"} = err;
    res.render("error.ejs" ,{message});
    // res.status(statusCode).send(message); 
});


app.listen(port, ()=>{
    console.log("app is Listning port  ",port);
});