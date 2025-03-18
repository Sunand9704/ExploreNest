const { required, ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const bookingSchema = new Schema({
    checkin :
    {
        type:Date,
        required:true,
    },
    checkout :
    {
        type:Date,
        required:true,
    },
    userid:
    {
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    placeid:
    {
        type:Schema.Types.ObjectId,
        ref:"Listing",
    },
    guest:
    {
        type:Number,
        required:true,
    },
});


const Book = mongoose.model("Book", bookingSchema);

module.exports = Book;
