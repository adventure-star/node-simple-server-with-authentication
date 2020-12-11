const Joi = require('joi');
// const bcrypt = require('bcrypt');

//using crypto instead of bcrypt
const crypto = require('crypto');

const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const admin = require("../middleware/admin");

router.post('/', admin, async (req, res) => {
  console.log(req);
    const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  // req.body.password = await crypto.createHash('sha256', req.body.password)                      
  //                         .update('How are you?') 
  //                         .digest('hex'); 


  // const validPassword = await bcrypt.compare(req.body.password, user.password);
  const validPassword = (req.body.password === user.password);

  if (!validPassword) return res.status(400).send('Invalid email or password.');
  
  const token = "1234567890";
  res.send(token);

});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 
