var express               = require("express"),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    session               = require("express-session"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("./models/user"),
    app                   = express(),
    camp                  = require("./models/campgrounds"),
    comment               = require("./models/comments"),
    seedDB                = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true,useUnifiedTopology:true,useFindAndModify:false });
// seedDB();
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  secret:"Yajas is sucha pr0 coder",//secret has to be any random english statement
  resave:false,
  saveUninitialized:false
  //the above three parameters should always be defined for auth to work
}));
app.use(passport.initialize()); //need these two to setup and initialize passport
app.use(passport.session());    //need these two to setup and initialize passport

app.use(function(req,res,next){//a way of declaring a middleware thats accessible and applicable all over the app
  res.locals.currentUser=req.user;//makes req.user accesible by the name currentUser - anywhere in each and every template without having to include this middlewhere or send it to the template
  next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//encodes session user input
passport.deserializeUser(User.deserializeUser());//decodes session user input
//==============================================================================
function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) {//isLoggedIn is understood by express and passport and the third argument is supposed to be next
    return next();//next is an argument understood by express to require the code folllowing the middleware to be executed if isAuthenticated() returns true
  }
  res.redirect("/login");
}
//==============================================================================
app.get("/",function(req,res){
  res.render("campgrounds/landing");
});
app.get("/campgrounds",function(req,res){
  camp.find({},function(err,campgrounds){
    if(err){
      console.log(err);
    }
    else {
      res.render("campgrounds/index",{campgrounds:campgrounds});
    }
  });
});
app.get("/campgrounds/new",function(req,res){
  res.render("campgrounds/new");
});
app.post("/campgrounds",function(req,res){
  var newCamp={
    name: req.body.name,
    img: req.body.img,
    description:req.body.description
  }
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
app.get("/campgrounds/:id",function(req,res){
  camp.findById(req.params.id).populate("comments").exec(function(err,campShow){
    if (err) {
      console.log(err);
    }
    else {
      res.render("campgrounds/show",{campShow:campShow});
    }
  });
});
//==========================================
//COMMENT SPECIFIC ROUTES
//============================================
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
  camp.findById(req.params.id,function(err,foundCamp){
    if (err) {
      console.log(err);
    }
    else {
      res.render("comments/new",{camp:foundCamp});}
    });
  });
  app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    camp.findById(req.params.id,function(err,foundCamp){
      if (err) {
        console.log(err);
      }
      else {
        comment.create(req.body.comment,function(err,comment){
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
//===============================================
//AUTH ROUTES
//===============================================
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){
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

app.get("/login",function(req,res){
  res.render("login");
});
app.post("/login",passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/login"
}),function(req,res){});

app.get("/logout",function(req,res){
  req.logOut();
  res.redirect("/campgrounds");
});
app.listen(3000);

// var campgrounds=[{name:"Mussorie",img:"https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",description:"Near Rishikesh, Very Silent and pictureqsue."},
//  {name:"Shimla",img:"https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",description:"Near Chandigarh,Very calm and peacefull"},
//  {name:"Manali",img:"https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",description:"Near Kullu, Famous for its snow and food"},
// {name:"Dharamshala",img:"https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",description:"Near McLoadganj, Famous for its momos and cricket Stadium"}];
// for(i=0;i<4;i++)
// {
// camp.create({
//               name:campgrounds[i].name,
//               img:campgrounds[i].img,
//               description:campgrounds[i].description
//             },function(err,camp){
//               if(err){
//                 console.log(err);
//               }
//               else {
//                 console.log(camp);
//               }
// });
// }
