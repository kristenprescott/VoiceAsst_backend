const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please enter a valid username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter a valid email address"],
    // unique: true,
    // match: [
    //   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    //   "Please provide a valid email address",
    // ],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    // minlength: 6,
    // select: false,
  },
  date: { type: Date, default: Date.now() },
  bio: String,
  todos: [{ type: Schema.Types.ObjectId, ref: "Todo" }],
  // roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
});

module.exports = model("User", userSchema);

// const mongoose = require("mongoose");

// const User = mongoose.model(
//   "User",
//   new mongoose.Schema({
//     username: String,
//     email: String,
//     password: String,
// roles: [
//   {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Role",
//   },
// ],
//   })
// );

// module.exports = User;

//////////////////////////////////////////////////////////////////////
/*
const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const { json } = require("express");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: [true, "Please enter a valid username"] },
  email: {
    type: String,
    required: [true, "Please enter a valid email address"],
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
*/
