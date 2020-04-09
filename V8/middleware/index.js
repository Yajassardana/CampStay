var middleware={};
var camp  = require("../models/campgrounds");
var comment=require("../models/comments");
var User=require("../models/user");
var passport=require("passport");
middleware.isLoggedIn=function(req,res,next){
    if (req.isAuthenticated()){//isLoggedIn is understood by express and passport and the third argument is supposed to be next
      return next();//next is an argument understood by express to require the code folllowing the middleware to be executed if isAuthenticated() returns true
    }
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");
  };

middleware.checkCampOwnership=function(req,res,next){
    if(req.isAuthenticated()){
      camp.findById(req.params.id,function(err,foundCamp){
        if (err||!foundCamp) {

          res.redirect("back");//redirects user back to where he/she came from
        }
        else {
          if(foundCamp.author.id.equals(req.user._id)){
            return next();
          }
          else {
            req.flash("error","You don't have permission to do that");
            res.redirect("back");
          }
        }
      });
    }
    else {
      req.flash("error","You need to be logged in to do that");
      res.redirect("back");
    }
  };

middleware.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
      comment.findById(req.params.cid,function(err,foundComment){
        if (err||!foundComment) {
          res.redirect("back");//redirects user back to where he/she came from
        }
        else {
          if(foundComment.author.id.equals(req.user._id)){
            return next();
          }
          else {
            req.flash("error","You don't have permission to do that");
            res.redirect("back");
          }
        }
      });
    }
    else {
      req.flash("error","You need to be logged in to do that");
      res.redirect("back");
    }
  };
module.exports=middleware;
