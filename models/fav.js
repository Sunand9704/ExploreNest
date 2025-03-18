const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favschema = new Schema({
    user:
    {
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    place:
    {
        type:Schema.Types.ObjectId,
        ref:"Listing",
    },
    
});


const Fav = mongoose.model("Fav", favschema);
module.exports = Fav;
