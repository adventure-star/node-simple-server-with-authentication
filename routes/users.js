const auth = require("../middleware/auth");
// const bcrypt = require("bcrypt");

//using crypto instead of bcrypt
const crypto = require('crypto');

const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.get("/next", auth, async (req, res) => {
  console.log(req);
  res.send("10000");
});

router.post("/", async (req, res) => {

  console.log("1");
  console.log(req.body);

  if (req.body.password !== req.body.repeatpassword) {
    return res.status(400).send("password confirm failed!");
  }

  const { error } = validate(req.body);

  console.log(error);


  if (error) return res.status(400).send(error.details[0].message);

  console.log("2")

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  // const salt = await bcrypt.genSalt(10);
  // user.password = await bcrypt.hash(user.password, salt);

  console.log(user);

  user.password = await crypto.createHash('sha256', user.password)
    .update('How are you?')
    .digest('hex');
  user.role = "normal";
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
