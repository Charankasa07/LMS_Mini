const mongoose = require('mongoose')

const schema = mongoose.Schema({
    userType:{
        type : String,
        required : true
    },
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
    // age:{
    //     type: Number,
    //     required :true
    // },
    gender:{
        type: String,
        required : true
    },
    // dob:{
    //     type: Date,
    //     required : true
    // },
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