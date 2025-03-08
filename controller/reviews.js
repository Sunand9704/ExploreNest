const Review = require("../models/review.js");
const Listing = require("..//models/listings.js");




module.exports.create = async(req,res) =>
    {
        console.log(req.params.id);
    let listning=await Listing.findById(req.params.id);
    let newreview =new Review(req.body.review);
    newreview.author = req.user._id;
    console.log(newreview);
    
    listning.reviews.push(newreview);
    
    
    await newreview.save(); 
    await listning.save();
    console.log("new revies savde");
    req.flash("success", "New review added");
    res.redirect(`/listings/${listning._id}`);
    
    
    };

module.exports.delete = async (req, res) => {
    console.log("Deleting route is");
    
    let { id, reviewid } = req.params;
    console.log("Listing ID:", id);
    console.log("Review ID:", reviewid);
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);  // Ensure correct model name
    req.flash("success", "Review  deleted ");

    res.redirect(`/listings/${id}`);
    };