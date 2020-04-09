var express =require("express");
var router  =express.Router();
var passport=require("passport");
var User=require("../models/user");
//HOME PAGE
router.get("/",function(req,res){
  res.render("campgrounds/landing");
});
//USER SIGNUP
router.get("/register",function(req,res){
  res.render("register");
});
router.post("/register",function(req,res){
  var newUser = new User({username:req.body.username});
  User.register(newUser,req.body.password,function(err,user){
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req,res,function(){
      res.redirect("/");
    });
  });
});
//USER LOGIN
router.get("/login",function(req,res){
  res.render("login");
});
router.post("/login",passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/login"
}),function(req,res){});
//USER LOGOUT
router.get("/logout",function(req,res){
  req.logOut();
  res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) {//isLoggedIn is understood by express and passport and the third argument is supposed to be next
    return next();//next is an argument understood by express to require the code folllowing the middleware to be executed if isAuthenticated() returns true
  }
  res.redirect("/login");
}
module.exports=router;
