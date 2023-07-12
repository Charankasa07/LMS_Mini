const express = require('express')
const app = express()
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const org_routes= require('./routes/org_routes')
const user_routes = require('./routes/user_routes')
const dotenv=require('dotenv')
const cors = require('cors')
const user_schema=require("./models/user_schema")
const org_schema= require('./models/org_schema')


dotenv.config()

mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser : true},console.log("connected to db"))

app.use(body_parser.json())
app.use(body_parser.urlencoded({extended:false}))
app.use(cors())
app.use('/org',org_routes)
app.use('/user',user_routes)

app.post('/login',async (req,res)=>{
    console.log(req.body);
    // const {error,value} = loginvalidation(req.body)
    // if(error) return res.status(400).send(error.details[0].message)
    // console.log(req.body);
    var data = await org_schema.findOne({org_mail:req.body.email})
    if(!data) {
        data = await user_schema.findOne({email:req.body.email})
        if(!data) return res.status(400).json("Account doesn't exist")
    }

    const validpass = await bcrypt.compare(req.body.password,data.password)
    if(!validpass) return res.status(400).json("Invalid Password")

    var data1 = await org_schema.findOne({org_mail:data.email})
    if(!data1){
        data1 = await user_schema.findOne({email:data.email})
        const token = jwt.sign({email:data1.email},process.env.TOKEN_SECRET)
        return res.setHeader('auth-token',token).status(200).json(data1)
    }
    const token = jwt.sign({org_mail:data1.email},process.env.TOKEN_SECRET_ORG)
    return res.setHeader('auth-token',token).status(200).json(data1)
})



app.get('/',(req,res)=>{
    res.send("LMS")
})

app.listen(4000,console.log("listening on port 4000"))

