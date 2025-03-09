const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const Listing = require("./listings");

const Review = require("./review.js"); 


const listingSchema = new Schema({
    title:
    {
        type:String,
        required:true,
    },
    description:String,
    image:
    {
       url:String,
       filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref:"Reviews",
      },
    ],
    owner:
    {
      type:Schema.Types.ObjectId,
      ref:"User",
    },
  
}); 

listingSchema.post("findOneAndDelete", async(listning) =>
  {
      if(listning)
      {
          await Review.deleteMany({_id : { $in :listning.reviews }});
      }
  });

  


const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;