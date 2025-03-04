const mongoose = require("mongoose");
const { min, type } = require("../schema");
const listingSchema = require("../schema.js");
const Listing = require("./listings");
const { authorize } = require("passport");
const Schema = mongoose.Schema;


const reviewsSchema = new Schema({
    comment:
    {
        type:String,
    },
    rating:
    {
        type:Number,
        min:1,
        max:5,
    },
    createdAt:
    {
        type:String,
        default: Date.now(),
    },
    author:
    {
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});


module.exports = mongoose.model("Reviews", reviewsSchema);
