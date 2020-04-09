var express =require("express");
var router  =express.Router({mergeParams:true});//allows access of params from app.js to here by making em shared
var camp    = require("../models/campgrounds");
var comment = require("../models/comments");
var middleware=require("../middleware");
//loggedIn middleware

//COMMENTS NEW
router.get("/new",middleware.isLoggedIn,function(req,res){
  camp.findById(req.params.id,function(err,foundCamp){
    if (err) {
      console.log(err);
    }
    else {
      res.render("comments/new",{camp:foundCamp});}
    });
  });
//COMMENTS CREATE
  router.post("/",middleware.isLoggedIn,function(req,res){
    camp.findById(req.params.id,function(err,foundCamp){
      if (err) {
        console.log(err);
      }
      else {
        var newComment={text:req.body.text,
                        author:{username:req.user.username,id:req.user._id}
                        };
        comment.create(newComment,function(err,comment){
          if (err) {
            console.log(err);
          }
          else {
            req.flash("success","Comment added")
            foundCamp.comments.push(comment);
            foundCamp.save();
            res.redirect("/campgrounds/"+req.params.id);
          }
        });
      }
    });
  });
  router.get("/:cid/edit",middleware.checkCommentOwnership,function(req,res){
    comment.findById(req.params.cid,function(user,foundComment){
      res.render("comments/edit",{comment:foundComment,campId:req.params.id});
    });
  });
  router.put("/:cid",middleware.checkCommentOwnership,function(req,res){
    comment.findByIdAndUpdate(req.params.cid,req.body.comment,function(err,foundComment){
      if (err) {
        res.redirect("back");
      }
      else {
        req.flash("success","Comment updated");
        res.redirect("/campgrounds/"+req.params.id);
      }
    });
  });
  router.delete("/:cid",middleware.checkCommentOwnership,function(req,res){
    comment.findByIdAndRemove(req.params.cid,function(err,foundComment){
      if (err) {
        cres.redirect("back");
      }
      else {
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
          }
    });
  });

module.exports=router;
