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
//Requiring Routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");
mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true,useUnifiedTopology:true,useFindAndModify:false });
//seedDB();
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

app.use("/campgrounds",campgroundRoutes);//including campgroundRoutes and appending "/campgrounds" to each rputes as they all have it in common so no nead to mention "/campgrounds" in each route in the campgroundRoutes file
app.use("/campgrounds/:id/comments",commentRoutes);//including commentRoutes and appending like above
app.use(indexRoutes);//including indexRoutes

app.listen(3000);
