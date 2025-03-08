const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");
const { deleteMany, insertMany } = require("../models/listings");

main().then(() => 
    {
       console.log("connection is sucesssful")
    })
    .catch(err => console.log(err));
    
    async function main() {
      await mongoose.connect('mongodb://127.0.0.1:27017/ExploreNest');
    }
    const initDB = async () =>{
        await Listing.deleteMany({});
        initData.data= initData.data.map((obj) =>({...obj, owner : '67c0a21f1a8ab1cf0744c213'}));
        await Listing.insertMany(initData.data);
        console.log("data was intitialised"); 

    };
    initDB();

