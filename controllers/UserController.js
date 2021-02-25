const User = require("../models/User");
const { to, generateOtp, isEmail } = require("../services/util.service");
const {
  ReturnEmptyError,
  ReturnInternalError,
  ReturnSuccess,
  mandodary,
} = require("../services/response.service");
const CONFIG = require("../config/config");

exports.register = async (req, res) => {
  let err, existPhone, existEmail, userData, user;
  const body = req.body;
  const fields = ["userName", "firstName", "userType", "lastName", "phone", "email"];
  mandodary(res, body, fields);

  if(!CONFIG.userType.includes(body.userType)) return ReturnEmptyError(res,"Enter valid user type");

  [err, existPhone] = await to(User.findOne({ phone: body.phone }));
  if (err) return ReturnInternalError(res, err);
  if (existPhone) return ReturnEmptyError(res, "This mobile number was already exist");

  [err, existEmail] = await to(User.findOne({ email: body.email }));
  if (err) return ReturnInternalError(res, err);
  if (existEmail) return ReturnEmptyError(res, "This email was already exist");

  let otp = generateOtp(6);

  [err, user] = await to(User.create({ ...body, otp: otp }));
  if (err) return ReturnInternalError(res, err);
  if (!user) return ReturnEmptyError(res, "User registration was failed");
  return ReturnSuccess(res, "User Registered successfully", {token: user.getJWT()});
};

exports.verify = async (req, res) => {
  let err, users, existUser;
  const user = req.user;
  const body = req.body;
  const fields = ["otp", "password"];
  mandodary(res, body, fields);

  [err, existUser] = await to(User.findOne({ _id: user }));
  if (err) return ReturnInternalError(res, err);
  if (!existUser) return ReturnEmptyError(res, "User was not found");

  if (existUser.otp !== body.otp) return ReturnEmptyError(res, "Enter the valid OTP");

  existUser.password = body.password;
  existUser.verify = true;

  [err, users] = await to(existUser.save());
  if (err) return ReturnInternalError(res, err);
  if (!user) return ReturnEmptyError(res, "Verification was failed");
  return ReturnSuccess(res, "Verified successfully", {data: users,token: users.getJWT()});
};

exports.login = async (req, res) => {
  let err, existUser, userToken, updateUser;
  const body = req.body;
  const fields = ["email", "password"];
  mandodary(res, body, fields);

  let query = {};
  if (isEmail(body.email)) {
    query.email = body.email;
  } else {
    query.phone = email;
  }

  [err, existUser] = await to(User.findOne(query));
  if (err) return ReturnInternalError(res, err);
  if (!existUser) return ReturnEmptyError(res,"Sorry, we can't find an account, please try again or create a new account.");

  [err, userToken] = await to(existUser.comparePassword(body.password));
  if (err) return ReturnInternalError(res, err);
  if (!userToken) return ReturnEmptyError(res, "Invalid credential");

  if (existUser.active === false) {
    [err, updateUser] = await to(User.updateOne({ _id: existUser._id }, { $set: { active: true } }));
    if (err) return ReturnInternalError(res, err);
    if (updateUser.nModified === 0) return ReturnEmptyError(res, "User update was failed");
  }

  return ReturnSuccess(res, "Login successfully", {token: userToken.getJWT()});
};

exports.profile = async (req, res) => {
  let err, existUser;
  const user = req.body;
  [err, existUser] = await to(User.findOne({ _id: user }));
  if (err) return ReturnInternalError(res, err);
  if (!existUser) return ReturnEmptyError(res, "User Details was not found");
  return ReturnSuccess(res, "User Details founded successfully", existUser);
};

exports.getUsers = async (req, res) => {
  let err, existUser;
  const query = req.query || {};
  [err, existUser] = await to(User.find(query));
  if (err) return ReturnInternalError(res, err);
  if (!existUser && existUser.length === 0) return ReturnEmptyError(res, "User details was not found");
  return ReturnSuccess(res, "User details was founded", existUser);
};