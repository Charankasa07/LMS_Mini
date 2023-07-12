const { date } = require("joi");
const mongoose = require("mongoose")

const schema = mongoose.Schema({
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'books',
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    issued_date:{
        type:Date,
        default:Date.now()
    },
    isIssued:{
        type:Boolean,
        default:false
    },
    isAccepted:{
        type:Boolean,
        default:false
    },
    isReturned:{
        type:Boolean,
        default:false
    },
    returned_date:{
        type:Date    
    }
},{collection:"bookings"});

module.exports = mongoose.model("bookings",schema)