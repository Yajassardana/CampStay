var express=require("express");
var app= express();
app.set("view engine","ejs");
app.use(express.static('public'));
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
var campgrounds=[{name:"Mussorie",img:"https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60"},
  {name:"Shimla",img:"https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60"},
  {name:"Manali",img:"https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60"}];
app.get("/",function(req,res){
  res.render("landing");
});
app.get("/campgrounds",function(req,res){
  res.render("campgrounds",{campgrounds:campgrounds});
});
app.get("/campgrounds/new",function(req,res){
  res.render("new");
});
app.post("/campgrounds",function(req,res){
  var newCamp={
    name: req.body.name,
    img: req.body.img
  };
  campgrounds.push(newCamp);
  res.redirect("campgrounds");
});
app.listen(3000);
