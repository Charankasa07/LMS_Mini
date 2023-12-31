const express = require("express");
const router = express.Router();
// const mongoose = require('mongoose')
const { ObjectId } = require("mongoose");
const user_schema = require("../models/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verify = require("../verifications/user_verification");
const path = require("path");
const sendMail = require("../nodemailer");
const bookings = require("../models/bookings");
const books = require("../models/books_schema");
const otp_schema = require("../models/otp_schema");
const {
  registerValidation,
  loginValidation,
} = require("../validations/user_validation");
// const instorage=multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,"../profiles")
//     },
//     filename:(req,file,cb)=>{
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// })
// const upload=multer({storage:instorage})
router.get("/get_data/:id", async (req, res) => {
  const data = await user_schema.findById(req.params.id);
  console.log(data);
  res.send(data);
});
router.get("/get-bookings-data/:user_name", verify, async (req, res) => {
  const userexist = await user_schema.findOne({
    user_name: req.params.user_name,
  });
  const data1 = {};
  const data = await bookings
    .find({ user: userexist._id })
    .populate("book", "title")
    .populate("org", "org_name")
    .then((p) => (data1 = p));
  const due_date = new Date();
  const issue_date = data1.issue_date;
  due_date.setDate(issue_date.getDate() + 7); //Considering 7 is the max days of limit to return a book
  res.send({ data, data1, due_date });
});
router.post("/book-now", async (req, res) => {
  console.log("booked");
  const { bid, email } = req.body;
  console.log(typeof bid);
  console.log(email);
  const data = await books.findById(bid);
  console.log(data);
  const body = `Your booking is registered for the book named ${data.title}`;
  const subject = "Booking registed";
  //   console.log( typeof newUserID);
  const data1 = await user_schema.findOne({ email: email });
  console.log(data1);
  try {
    if (data.copies != 0) {
      // const user_name=verify.user_name
      const newBooking = new bookings({
        book: bid,
        user: uid,
      });
      await newBooking.save();
      sendMail(data1.email, subject, body);
      // await books.findOneAndUpdate({title:title,org_name:org_name},{$inc:{copies:-1}})
      res.redirect("/booking-message");
    } else {
      res.send("Book is currently unavailable");
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/register", async (req, res) => {
  const { error, value } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
  //checking if email exists or  not
  const emailexist = await user_schema.findOne({ mail: req.body.email });
  if (emailexist) return res.status(400).send("Email already exist");
  const user_name_exist = await user_schema.findOne({
    user_name: req.body.user_name,
  });
  if (user_name_exist) return res.status(400).send("user_name already exist");
  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(req.body.password, salt);
  try {
    // const newotp=new otp_schema({
    //     mail:req.body.mail,
    //     otp:otp1
    // })
    const usernew = new user_schema({
      userName: req.body.userName,
      clg_id: req.body.clg_id,
      email: req.body.email,
      password: hashedpassword,
      branch: req.body.branch,
      mobileNumber: req.body.mobileNumber,
      userType: req.body.userType,
      gender: req.body.gender,
      // profile:req.file.filename
    });
    await usernew.save();
    console.log(usernew);
    res.json(usernew);
  } catch (err) {
    res.send(err.message);
  }
});
router.get("/send-otp/:mail", async (req, res) => {
  //generating 6 or 7 digit otp
  const otp = Math.floor(100000 + Math.random() * 900000);
  const subject = "OTP for Verification";
  const text =
    "Please enter this otp to get verified" +
    otp +
    "it will get expired in 10 minutes";
  sendMail(req.params.mail, subject, text);
  const date = new Date();
  const expiresIn = new Date();
  expiresIn.setTime(date.getTime() + 10 * 60 * 1000);
  // console.log(expiresIn)
  const new_otp = new otp_schema({
    otp,
    mail: req.params.mail,
    expiresIn,
  });

  try {
    const data = await otp_schema.findOne({ mail: req.params.mail });
    if (!data) {
      await new_otp.save();
    } else {
      await otp_schema.findOneAndUpdate(
        { mail: req.params.mail },
        { $set: { otp, expiresIn } },
        { new: true }
      );
    }
  } catch (error) {
    res.send(error);
  }
});
router.post("/otp-verification/:mail", async (req, res) => {
  const mail1 = req.params.mail;
  const otp = req.body.otp;
  const data = await otp_schema.findOne({ mail: mail1 });
  if (!data) return res.status(400).send("No otp found for your mail");
  try {
    if (data.expiresIn <= new Date().getTime())
      return res.status(400).send("OTP expired");
    if (otp === data.otp) {
      await user_schema.findOneAndUpdate(
        { mail: mail1 },
        { $set: { isverified: true } }
      );
      data = await user_schema.findOne({ mail: mail1 });
      const token = jwt.sign(
        { user_name: data.user_name },
        process.env.TOKEN_SECRET
      );
      res.header("auth-token", token).send(token);
    } else {
      res.send("OTP that you have entered is wrong");
    }
  } catch (error) {
    res.send(error);
  }
});
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //checking if user_name exists or  not
  const user_name_exist = await user_schema.findOne({
    user_name: req.body.user_name,
  });
  if (!user_name_exist) return res.status(400).send("user name is not found");
  //Verification check
  if (user_name_exist.isverified != true)
    return res.send("Email verification is not done");
  //password validation
  const validPass = await bcrypt.compare(
    req.body.password,
    user_name_exist.password
  );
  if (!validPass) return res.send("invalid password!");
  //token generation
  const token = jwt.sign(
    { user_name: user_name_exist.user_name },
    process.env.TOKEN_SECRET
  );
  res.header("auth-token", token).send(token);
});
router.post("/forgotpassword", async (req, res) => {
  mail1 = req.body.email;
  console.log(mail1);
  try {
    const isuser = await user_schema.findOne({ email: mail1 });
    if (!isuser) {
      return res.send("User not exists!");
    }
    const secret = process.env.TOKEN_SECRET + isuser.password;
    const token = jwt.sign({ user_name: isuser.user_name }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:4000/user/reset-password/${isuser.user_name}/${token}`;
    const subject = "Reset Password";
    await sendMail(mail1, subject, link);
    res.send(link);
  } catch (err) {
    res.send(err.message);
  }
});
router.get("/reset-password/:user_name/:token", async (req, res) => {
  const user_name2 = req.params.user_name;
  const token1 = req.params.token;
  const isuser = await user_schema.findOne({ user_name: user_name2 });
  if (!isuser) {
    return res.send("User not exist!");
  }
  const secret = process.env.TOKEN_SECRET + isuser.password;
  try {
    const verify1 = jwt.verify(token1, secret);
    res.sendFile(path.join(__dirname, "..", "/files", "/index.html"));
  } catch (error) {
    res.send("Not verified");
    console.log(error);
  }
});
router.post("/reset-password/:user_name/:token", async (req, res) => {
  const user_name2 = req.params.user_name;
  const token2 = req.params.token;
  const isuser = await user_schema.findOne({ user_name: user_name2 });
  if (!isuser) {
    return res.send("User not exist!");
  }
  const password = req.body.password;
  const password1 = req.body.confirm_password;
  if (password == password1) {
    try {
      const secret = process.env.TOKEN_SECRET + isuser.password;
      const verify = jwt.verify(token2, secret);
      const hashPassword = await bcrypt.hash(password, 10);
      await user_schema.findOneAndUpdate(
        { user_name: user_name2 },
        { $set: { password: hashPassword } }
      );
      res
        .status(200)
        .send({ status: "Success", message: "Password updated succesfully" });
    } catch (err) {
      res.send(err.message);
    }
  } else {
    res.send("Password didtn't matched");
  }
});
router.post("/delete", async (req, res) => {
  const user_name_exist = await user_schema.findOne({
    user_name: req.body.user_name,
  });
  if (!user_name_exist) return res.status(400).send("user name is not found");
  const validPass = await bcrypt.compare(
    req.body.password,
    user_name_exist.password
  );
  if (!validPass) return res.send("invalid password!");
  else {
    user_schema.deleteOne(
      { user_name: req.body.user_name },
      function (err, obj) {
        if (err) {
          res.send(err.message);
        }
      }
    );
    res.send("deleted successfully");
  }
});
module.exports = router;
