const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/key');
const passport = require('passport');

//Load input validation
const validateRegisterInput = require('../../validation/register');

const User = require('../../models/User');

// @route GET api/users/test
//@desc Tests posts route
//@access public route
router.get('/test', (req, res) => res.json({msg: "Users Works"}));

// @route GET api/users/register
//@desc Register user
//@access public route
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //check Validation
  if(!isValid){
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email })
    .then(user => {
      if(user){
        return res.status(400).json({email: 'Email already taken'});
      }else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', //size
          r: 'pg', //Rating
          d: 'mm' // Default
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err,salt) => {
          bcrypt.hash(newUser.password,salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
});

// @route GET api/users/login
//@desc Login User / returning JWT token
//@access public route

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({email})
    .then(user => {
      //check for user
      if(!user){
        return res.status(404).json({email: 'User not found'});
      }

      //check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch){
            //User Matched

            //create jwt payload
            const payload = { id: user.id, name: user.name, avatar: user.avatar };
            //Sign token
            jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err,token) => {
              res.json({
                success: true,
                token: `Bearer ${token}`
              });
            });
          }else{
            return res.status(400).json({password: 'Incorrect username/password'});
          }
        });
    });
});

// @route GET api/users/current
//@desc return current user
//@access private route
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) =>{
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;
