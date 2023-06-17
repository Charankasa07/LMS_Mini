const mongoose = require('mongoose')

const schema = mongoose.Schema({
        org_name:{
            type:String,
            required:true
        },
        org_mail:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        telephone:{
            type:Number,
            required:false
        },
        isverified:{
            type:Boolean,
            default:false
        },
        isAdmin:{
            type: Boolean,
            default: true
        }
        
},
    {collection:"organization"});

 module.exports= mongoose.model("organization",schema)   