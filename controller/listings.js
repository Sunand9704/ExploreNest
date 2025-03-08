const Listing = require("../models/listings.js");
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
   listing.lat = listing.latitude || 0;
   listing.lon = listing.longitude || 0;
   res.render("listings/show.ejs", {listing} );
   listing.save();
};
//4 create listing
module.exports.createlis = async (req, res, next) => {
  let url = req.body.file;
  let filename= req.body.file;

  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = {url,filename};
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
    let imageUrl = req.file.path; 
    let filename = req.file.filename; 
    List.image= {url,filename};
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

