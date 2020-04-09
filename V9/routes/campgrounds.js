var express=require("express");
var router=express.Router();
var camp  = require("../models/campgrounds");
var comment=require("../models/comments");
var middleware=require("../middleware");//automtically looks for a file named index.js
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
router.get("/new",middleware.isLoggedIn,function(req,res){
  res.render("campgrounds/new");
});
//CREATE NEW CAMPGROUND
router.post("/",middleware.isLoggedIn,function(req,res){
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
router.get("/:id/edit",middleware.checkCampOwnership,function(req,res){
  camp.findById(req.params.id,function(err,camp){
      res.render("campgrounds/edit",{camp:camp});
  });
});
router.put("/:id",middleware.checkCampOwnership,function(req,res){
  camp.findByIdAndUpdate(req.params.id,req.body.campground,function(err,camp){//only edits the fields mentioned inside req.body.campgroundand lets the other fields remain as it is
    if (err) {
      console.log(err);
    }
    else {
      // no need to assign username and id again as findByIdAndUpdate does not replace the object at id by the passed object, it just replaces the arguments of the object at id by the passed object's arguments, whatever they may be, even apssing argument is allowoed, in which case the other arguments would remain as it is
      // camp.author.username=req.user.username;
      // camp.author.id=req.user._id;
      // camp.save();
      req.flash("success","Campground updated");
      res.redirect("/campgrounds/"+camp._id);
    }
  });
});
router.delete("/:id",middleware.checkCampOwnership,function(req,res){
  camp.findByIdAndRemove(req.params.id,function(err,camp){
    if (err) {
      console.log(err);
      res.redirect("/campgrounds/"+camp._id);
    }
    else {
      comment.deleteMany({_id:{$in:camp.comments}},function(err){//deleting all comments associated with that campgrpund from the db
        if (err) {
          console.log(err);
        }
        else {
          console.log(camp);
          req.flash("success","Campground deleted");
          res.redirect("/campgrounds");
        }
      });
    }
  });
});

module.exports=router;
