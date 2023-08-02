const mongoose = require('mongoose');
const schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs')
var mongoosePaginate = require("mongoose-paginate");

var userModel = new schema({
  name: String,

  email: String,

  gender: String,

  country: String,

  city: String,

  address: String,

  countryCode: String,

  mobileNumber: String,

  password: String,

  profilePic: String,

  coverPhoto: String,

  otp: String,
  profilePic: String,
  walletAddress: String,
  ordinalPoints: {
    type: Number,
    default: 0
  },
  otpTime: { type: Number, default: Date.now() },

  otpVerification: { type: Boolean, default: false },
  userType: {
    type: String,
    enum: ["ADMIN", "SUBADMIN", "USER"],
    default: "USER",
    uppercase: true
  },
  status: {
    type: String,
    enum: ["ACTIVE", "BLOCK", "DELETE"],
    default: "ACTIVE"
  },


}, { timestamps: true });

userModel.plugin(mongoosePaginate)
module.exports = mongoose.model("user", userModel);

mongoose.model("user", userModel).find({ userType: "ADMIN" }, (err, result) => {
  if (err) {
    console.log("DEFAULT ADMIN ERROR", err);
  } else if (result.length != 0) {
    console.log("Default Admin.");
  } else {
    let obj = {
      userType: "ADMIN",
      name: "Ordinal",
      country: "INDIA",
      profilePic: "https://res.cloudinary.com/dkoznoze6/image/upload/v1563943105/n7zdoyvpxxqhexqybvkx.jpg",
      verifyOtp: true,
      countryCode: "+00",
      mobileNumber: "0000000000",
      email: "ordinal@mailinator.com",
      password: bcrypt.hashSync("Ordinal@1")
    };
    mongoose.model("user", userModel).create(obj, (err1, result1) => {
      if (err1) {
        console.log("DEFAULT ADMIN  creation ERROR", err1);
      } else {
        console.log("DEFAULT ADMIN Created", result1);
      }
    });
  }
});




