const { required } = require("joi");
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
});


const Book = mongoose.model("Book", bookingSchema);

module.exports = Book;
