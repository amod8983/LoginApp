const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

userSchema.methods.comparePassword=(hash,password)=>{
 return bcrypt.compareSync(password,hash);
};

module.exports=mongoose.model('User',userSchema);