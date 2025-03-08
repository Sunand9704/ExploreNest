const User = require("../models/user");


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
