var mongoose=require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
  username:String,
  password:String
});
userSchema.plugin(passportLocalMongoose);//Adds methods of passport-local-mongoose to userSchema like serialize and deserialize
module.exports=mongoose.model("User",userSchema);
