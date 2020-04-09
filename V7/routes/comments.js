var express =require("express");
var router  =express.Router({mergeParams:true});//allows access of params from app.js to here by making em shared
var camp    = require("../models/campgrounds");
var comment = require("../models/comments");
//loggedIn middleware

//COMMENTS NEW
router.get("/new",isLoggedIn,function(req,res){
  camp.findById(req.params.id,function(err,foundCamp){
    if (err) {
      console.log(err);
    }
    else {
      res.render("comments/new",{camp:foundCamp});}
    });
  });
//COMMENTS CREATE
  router.post("/",isLoggedIn,function(req,res){
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
            foundCamp.comments.push(comment);
            foundCamp.save();
            res.redirect("/campgrounds/"+req.params.id);
          }
        });
      }
    });
  });
  router.get("/:cid/edit",checkCommentOwnership,function(req,res){
    comment.findById(req.params.cid,function(user,foundComment){
      res.render("comments/edit",{comment:foundComment,campId:req.params.id});
    });
  });
  router.put("/:cid",checkCommentOwnership,function(req,res){
    comment.findByIdAndUpdate(req.params.cid,req.body.comment,function(err,foundComment){
      if (err) {
        res.redirect("back");
      }
      else {
        res.redirect("/campgrounds/"+req.params.id);
      }
    });
  });
  router.delete("/:cid",checkCommentOwnership,function(req,res){
    comment.findByIdAndRemove(req.params.cid,function(err,foundComment){
      if (err) {
        cres.redirect("back");
      }
      else {
        camp.findById(req.params.id,function(err,foundCamp){
          if (err) {
            console.log(err);
          }
          else {
            var index=foundCamp.comments.indexOf(foundComment._id);
            foundCamp.comments.splice(index,1);
            res.redirect("/campgrounds/"+req.params.id);
          }
        });
      }
    });
  });
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {//isLoggedIn is understood by express and passport and the third argument is supposed to be next
      return next();//next is an argument understood by express to require the code folllowing the middleware to be executed if isAuthenticated() returns true
    }
    res.redirect("/login");
  };
function checkCommentOwnership(req,res,next){
  if(req.isAuthenticated()){
    comment.findById(req.params.cid,function(err,foundComment){
      if (err) {
        res.redirect("back");//redirects user back to where he/she came from
      }
      else {
        if(foundComment.author.id.equals(req.user._id)){
          return next();
        }
        else {
          res.redirect("back");
        }
      }
    });
  }
  else {
    res.redirect("back");
  }
};
module.exports=router;
