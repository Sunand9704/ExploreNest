const cloudinary = require("cloudinary").v2;  // ✅ Add this
const { storage } = require("../cloudconfig"); // If you have cloudconfig.js
const multer = require("multer");
const upload = multer({ storage });
const Listing = require("../models/listings.js");
const Book = require("../models/booking.js");

module.exports.index = async (req,res) => {
    let allistings = await Listing.find({});
    res.render("listings/index.ejs", {allistings});
 };
 // 2 new form
 module.exports.rendernewform = (req,res) =>{
    res.render("listings/new.ejs");
};
//3 Show Route
async (req,res) =>{
     const id = req.params.id;
    
     let listing = await Listing.findById(id).populate({
        path:"reviews", 
        populate:{
        path:"author",
    }
    }).populate("owner");
    if(!listing)
    {
        req.flash("error", "Listing not exixted");
        res.redirect("/listings");
    
    }
    
    res.render("listings/show.ejs", {listing} );
    listing.save();
 };
 //3 show route
module.exports.showlisting = async (req,res) =>{
    const id = req.params.id;
   let listing = await Listing.findById(id)
    .populate({
       path:"reviews", 
       populate:{
       path:"author",
   }
   }).populate("owner");
   if(!listing)
   {
       req.flash("error", "Listing not exixted");
       res.redirect("/listings");
   
   }
   res.render("listings/show.ejs", {listing} );
   listing.save();
};


//4 create listing
module.exports.createlis = async (req, res, next) => {
    const result = await cloudinary.uploader.upload(req.file.path);  
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url: result.secure_url, filename: result.public_id }; // ✅ Save correct Cloudinary URL
    await newlisting.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};




//edit form
module.exports.editform = async (req,res) =>
    {
    const {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing)
        {
            req.flash("error", "Listing not exixted");
            res.redirect("/listings");
        }


        let orgimgurl = listing.image.url;
        orgimgurl =  orgimgurl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing,orgimgurl});
    };

module.exports.update = async (req,res,next) =>{
const {id} = req.params;

    let List = await Listing.findByIdAndUpdate(id, {...req.body.listing});


    if(typeof req.file != "undefined"){
        const result = await cloudinary.uploader.upload(req.file.path);
        List.image = { url: result.secure_url, filename: result.public_id };
        await List.save();
        
    await List.save();
    }
    req.flash("success", "Updated  Succrssfully");
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async(req,res)=>{

    let {id} = req.params;
    
    console.log("Delete request received for ID:", id); //
    let del = await Listing.findByIdAndDelete(id);
    
    if (!del) {
       throw new ExpressError(404, "Listing not found");
    }
    console.log("Deleted Listing:", del);
    req.flash("success", " Lisiting deleted");
    
    return res.redirect("/listings");
    };

///search routr

module.exports.searching = async (req ,res) => {
    let { query } = req.query;
    query = query.trim();
    try {
        const allListings = await Listing.find({
              $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { location: { $regex: query, $options: 'i' } },
                    { country: { $regex: query, $options: 'i' } },
              ]
        });
        allListings.forEach(listing => {
              listing.formattedPrice = listing.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
        });
        res.render("listings/search.ejs" , {allListings , query});
  } catch (err) {
        console.error("Error in search:", err);
        res.status(500).send('Server Error');
  }
};


//booking
module.exports.booking = async (req,res) =>
{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayDate = `${yyyy}-${mm}-${dd}`;   
    console.log(Date.now());
    res.render("listings/booking.ejs",{listing, todayDate});
};

// module.exports.booking= async(req,res,)=>
// {
//     let {id} = req.params;
//     let {checkin, checkout} = req.body;
//     console.log(checkin,checkout);

// }

//booked

 module.exports.booked = async (req, res) => {
      
    let {id} = req.params;
    let {checkin, checkout,guest} = req.body;
    console.log(checkin,checkout,guest);

    ///
    const checkinDate = new Date(checkin);
const checkoutDate = new Date(checkout);
//
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const todayDate = `${yyyy}-${mm}-${dd}`;
//
    const listing = await Listing.findById(id);
    const data = new Book({checkin,checkout});
    if (checkinDate > checkoutDate || checkinDate < today) {
        req.flash("error", "Please enter a valid date");
        return res.redirect(`/listings/${id}/book`);
    }    
    else
    {
    await data.save();
        // dates saved here

    //calcu
    let totalprice = listing.price*(guest/2);
    req.flash("success", "booked");
    res.render("listings/booked.ejs",{data,listing,totalprice,guest,});
    }
};
