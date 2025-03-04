const Listing = require("./models/listings");
const Review = require("./models/review.js");

const ExpressError = require("./utils/ExpressErr.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isloggedin =(req,res,next) =>
{    
    if(!req.isAuthenticated())
        {
            req.session.redirectUrl = req.originalUrl;
            req.flash("error", "you must be logged in to ExploreNest");
            return res.redirect("/login");
        };
        next();   
}; 


module.exports.saveRedirectUrl = (req,res,next) =>
{
    if(req.session.redirectUrl )
    {
        res.locals.redirectUrl = req.session.redirectUrl ;
    };
    next();
};

module.exports.isowner = async (req,res,next) =>
{
    let {id} =req.params;
    let listing = await Listing.findByIdAndUpdate(id);
    if(!listing.owner._id.equals(res.locals.currenuser._id))
    {
        req.flash("error", "you are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isauthor = async (req,res,next) =>
    {
        let {reviewid, id} =req.params;
        let review = await Review.findByIdAndUpdate(reviewid);
        if(!review.author._id.equals(res.locals.currenuser._id))
        {
            req.flash("error", "you are not the author of the review");
            return res.redirect(`/listings/${id}`);
        }
        next();
    };