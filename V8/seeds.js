var express=require("express");
var camp=require("./models/campgrounds");
var comment=require("./models/comments");
var campgrounds=[{name:"Mussorie",img:"https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",description:"Near Rishikesh, Very Silent and pictureqsue."},
{name:"Shimla",img:"https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",description:"Near Chandigarh,Very calm and peacefull"},
{name:"Manali",img:"https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",description:"Near Kullu, Famous for its snow and food"},
{name:"Dharamshala",img:"https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",description:"Near McLoadganj, Famous for its momos and cricket Stadium"}];
function seedDB(){
  camp.deleteMany({},function(err){
    if (err) {
      console.log(err);
    }
    console.log("removed all campgrounds");
});
}

module.exports=seedDB;
