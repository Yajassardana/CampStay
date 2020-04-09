var express    =require("express");
    app        = express(),
    bodyParser =require("body-parser"),
    mongoose   =require("mongoose");
var camp=require("./models/campgrounds");
var comment=require("./models/comments");
var seedDB=require("./seeds");
mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true,useUnifiedTopology:true,useFindAndModify:false });
// seedDB();
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
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
app.get("/campgrounds/:id/comments/new",function(req,res){
  camp.findById(req.params.id,function(err,foundCamp){
  if (err) {
  console.log(err);
  }
  else {
res.render("comments/new",{camp:foundCamp});}
});
});
app.post("/campgrounds/:id/comments",function(req,res){
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
