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
  function isLoggedIn(req,res,next){
      if (req.isAuthenticated()) {//isLoggedIn is understood by express and passport and the third argument is supposed to be next
        return next();//next is an argument understood by express to require the code folllowing the middleware to be executed if isAuthenticated() returns true
      }
      res.redirect("/login");
    };
module.exports=router;
