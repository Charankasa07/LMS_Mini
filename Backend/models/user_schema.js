const mongoose = require('mongoose')

const schema = mongoose.Schema({
    userName:{
        type:String,
        required:true,
        min:6
    },
    clg_id:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        min:8
    },
    mobileNumber:{
        type:String,
        required:true,
        min:10
    },
    profile:{
        type:String,
        required:false
    },
    branch:{
        type:String,
        min:3,
        required:true
    },
    otp:{
        type:Number,
        min:6
    },
    isverified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type: Boolean,
        default: false
    }

},{collection:"users"})

module.exports=mongoose.model("users",schema)