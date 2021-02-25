const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { ThrowInLog, ThrowError } = require('../services/response.service');
const { isNull } = require('../services/util.service');
const CONFIG = require('../config/config');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: CONFIG.userType
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
    verify:{
        type: Boolean,
        default: false
    },
    profilePic: {
        type: String
    },
    password: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    },
});

UserSchema.pre("save", async function (next) {
    if (isNull(this.password)) {
      return;
    }
  
    if (this.isModified("password") || this.isNew) {
      let err, salt, hash;
      [err, salt] = await to(bcrypt.genSalt(10));
      if (err) ThrowInLog(err.message);
  
      [err, hash] = await to(bcrypt.hash(this.password, salt));
      if (err) ThrowInLog(err.message);
  
      this.password = hash;
    } else {
      return next();
    }
  });
  
  UserSchema.methods.comparePassword = async function (pw) {
    let err, pass;
    if (!this.password) ThrowError("password not set");
    [err, pass] = await to(bcrypt.compare(pw, this.password));
    if (err) ThrowError(err);
  
    if (!pass) ThrowError("Email/password did not match. Please try again.");
  
    return this;
  };
  
  UserSchema.methods.getJWT = function () {
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    return (
      "Bearer " +
      jwt.sign({ user_id: this._id }, CONFIG.jwt_encryption, {
        expiresIn: expiration_time,
      })
    );
  };
  
  UserSchema.methods.toWeb = function () {
    let json = this.toJSON();
    json.id = this._id; //this is for the front end
    // json.password = undefined
    return json;
  };
  

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(aggregatePaginate);
module.exports = Chat = mongoose.model("User", UserSchema);