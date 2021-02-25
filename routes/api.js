// API
const express = require("express");
const router = express.Router();

const passport = require('passport');
const path = require('path');
const jwtAuth = require('../middleware/passport');

const UserController = require('../controllers/UserController');

const authUser = jwtAuth(passport).authenticate("jwt", { session: false });

//user routes
router.post("/user/register", UserController.register);
router.post("/user/verify", authUser, UserController.verify);
router.put("/user/address",authUser, UserController.updateAddress);
router.put("/user/qualification",authUser, UserController.userQualification);
router.put("/user/work",authUser, UserController.userWork);
router.post("/user/login", UserController.login);
router.get("/user/profile",authUser,UserController.profile);
router.get("/user/get",authUser,UserController.getUsers);
router.put("/user/update", authUser, UserController.updateProfile);
router.put("/user/block", authUser, UserController.blockUser);

module.exports = router;