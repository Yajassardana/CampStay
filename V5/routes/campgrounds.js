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
router.get("/new",function(req,res){
  res.render("campgrounds/new");
});
//CREATE NEW CAMPGROUND
router.post("/",function(req,res){
  var newCamp= req.body.campground;
  camp.create(newCamp,function(err,campground){
    if(err){
      console.log(err);
    }
    else {
      console.log(campground);
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

module.exports=router;
