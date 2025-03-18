const User = require("../models/user");
const Booking = require("../models/booking.js");
const Listing = require("../models/listings.js");
const Fav = require("../models/fav.js");



module.exports.signup = (req,res) =>
{
    res.render("users/signup.ejs"); 
};

module.exports.signups = async(req,res)=>
{
    try
    {
        let {username, email, password} = req.body;
    let newUser = new User({username, email});
    const newregis =await User.register(newUser, password);
    console.log(newregis);
    req.login(newregis,(err)=> {
        if(err)
        {
            return next(err);
        }
        req.flash("success", "Welcome to ExploreNest");
        res.redirect("/listings");
    });
    }
    catch(e)
    {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginform = (req,res)=>
{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>
    {
        req.flash("success", "Welcome back to ExploreNest!");
        let redirect = res.locals.redirectUrl || "/listings";
        res.redirect(redirect);
    };


module.exports.logout =  (req,res,next)=>
    {
        req.logout((error) =>{
            if(error)
            {
                return  next(error);
            }
            req.flash("success", "you are logged out!");
            res.redirect("/listings");
        });
    };


module.exports.dashboard = async(req,res) =>
{
    res.render("dashboard/home.ejs");
}

    module.exports.bookings = async(req,res) =>
        {
            const userId = req.user._id; // assuming user is logged in and stored in req.user
            const bookings = await Booking.find({userid:userId}).populate('placeid');
            
            console.log(bookings);
            
            res.render("dashboard/bookings.ejs", { bookings });
           
        }
        
        module.exports.favorites = async (req, res) => {
            const { placeid } = req.params;
            const userId = req.user._id;
            console.log("User ID:", userId);
        
            let user = await User.findById(userId).populate("fav"); // Populate fav
        
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
        
            // Convert fav to an array if not already
            if (!user.fav) {
                user.fav = [];
            }
          
            // Check if place is already in favorites
            if (user.fav.some((fav) => fav.place.toString() === placeid)) {
                console.log("Already in favorites");
                req.flash("error", "Already it is Saved")
                return res.redirect(`/listings/${placeid}`);
            }
            else
            {
                let fav = new Fav({ user: userId, place: placeid });
            await fav.save();
        
            user.fav.push(fav._id);
            await user.save();
        
            req.flash("success", "Added to Favorites");
            res.redirect(`/listings/${placeid}`);
            }
            
            
        };
        
          module.exports.myfavorites = async(req,res) =>
         {
            const userid = req.user._id;
            console.log(userid);
            
            let favo = await Fav.find({ user: userid }).populate("place");
                    
            res.render("dashboard/favorites.ejs",{favo});
        }


module.exports.favdel = async (req, res) => {
     
        try {
            let { id } = req.params;
            let del = await Fav.findByIdAndDelete(id);
            req.flash("success", "Removed from Favoraties");
            if (!del) {
                return res.status(404).json({ success: false, message: "Favorite not found" });
            }
          

            res.json({ success: true, message: "Favorite removed" });
            
        } catch (error) {
           
            res.status(500).json({ success: false, message: "Something went wrong" });
        }
    };    
    


