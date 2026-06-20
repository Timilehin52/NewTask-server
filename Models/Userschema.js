const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName : {
        type : String,
        required : true,
        trim : true
    },
    lastName : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
    },
    phoneNumber : {
        type : String,
        required : true,
        trim : true,
        unique : true,      
    },
    password : {
        type : String,
        required : true,
    },
    role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    },
    resetToken : String,
    resetTokenExpiry : Date,
}, { timestamps : true})

const USER = mongoose.model("User", userSchema)
module.exports = USER