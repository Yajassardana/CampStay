var mongoose=require("mongoose");
var campSchema= new mongoose.Schema({
  name:String,
  img:String,
  description: String,
  comments:[{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Comment"
}],
 author:{id: {type:mongoose.Schema.Types.ObjectId,
              ref:"User"},//saves id of type user- imp syntax
        username:String
       }
});
module.exports=mongoose.model("Camp",campSchema);
