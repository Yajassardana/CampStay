var mongoose=require("mongoose");
var commentSchema=new mongoose.Schema({
 text:String,
 author:{id: {type:mongoose.Schema.Types.ObjectId,
               ref:"User"},//saves id of type user- imp syntax
         username:String
        }
});
module.exports=mongoose.model("Comment",commentSchema);
