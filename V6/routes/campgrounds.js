var express=require("express");
var router=express.Router();
var camp  = require("../models/campgrounds");
//LIST OF CAMPGROUNDS - INDEX PAGE
router.get("/",function(req,res){
  camp.find({},function(err,campgrounds){
    if(err){
      console.log(err);
    }
    else {
      res.render("campgrounds/index",{campgrounds:campgrounds});
    }
  });
});
//NEW CAMPGROUND FORM
router.get("/new",isLoggedIn,function(req,res){
  res.render("campgrounds/new");
});
//CREATE NEW CAMPGROUND
router.post("/",isLoggedIn,function(req,res){
  var newCamp= req.body.campground;
  camp.create(newCamp,function(err,campground){
    if(err){
      console.log(err);
    }
    else {
      console.log(campground);
      campground.author.id= req.user._id;
      campground.author.username= req.user.username;
      campground.save();//ya toh aise assignments karke fir save karlo ya create se pehle hi newobject mei assigment karke fir pass karlo create ko taki ye save wali mehnat na karni padhe.Comments mei aise hi kara hai for variety 
    }
  });
  res.redirect("campgrounds");
});
//CAMPGROUND SHOW
router.get("/:id",function(req,res){
  camp.findById(req.params.id).populate("comments").exec(function(err,campShow){
    if (err) {
      console.log(err);
    }
    else {
      res.render("campgrounds/show",{campShow:campShow});
    }
  });
});
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {//isLoggedIn is understood by express and passport and the third argument is supposed to be next
      return next();//next is an argument understood by express to require the code folllowing the middleware to be executed if isAuthenticated() returns true
    }
    res.redirect("/login");
  };
module.exports=router;
