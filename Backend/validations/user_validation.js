const joi=require("joi")

const registerValidation=(data)=>{
    const sch=joi.object({
        userName:joi.string().required().min(6),
        clg_id: joi.string().required(),
        email:joi.string().required().email(),
        password:joi.string().required().min(8),
        branch:joi.string().required().min(3),
        mobileNumber:joi.string().required().min(10),
        gender : joi.string().required(),
        userType : joi.string().required()
    });
    
    return sch.validate(data)
}

const loginValidation=(data)=>{
    const sch=joi.object({
        userName:joi.string().required().min(6),
        password:joi.string().required().min(8)
    });
    
    return sch.validate(data)
}
module.exports.registerValidation=registerValidation
module.exports.loginValidation=loginValidation