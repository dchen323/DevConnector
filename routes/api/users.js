import express from 'express';
const router = express.Router();
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getKey from '../../config/key';
import passport from 'passport';

//Load input validation
import validateRegisterInput from '../../validation/register';
import validateLoginInput from '../../validation/login';

import User from '../../models/User';

// @route GET api/users/test
//@desc Tests posts route
//@access public route
router.get('/test', (req, res) => res.json({msg: "Users Works"}));

// @route POST api/users/register
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
        errors.email = 'Email already taken';
        return res.status(400).json(errors);
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
  const { errors, isValid } = validateLoginInput(req.body);

  //check Validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({email})
    .then(user => {
      //check for user
      if(!user){
        errors.email = "User not found";
        return res.status(404).json(errors);
      }

      //check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch){
            //User Matched

            //create jwt payload
            const payload = { id: user.id, name: user.name, avatar: user.avatar };
            //Sign token
            jwt.sign(payload, getKey("secretOrKey"), { expiresIn: 3600 }, (err,token) => {
              res.json({
                success: true,
                token: `Bearer ${token}`
              });
            });
          }else{
            errors.password = 'Incorrect username/password';
            return res.status(400).json(errors);
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

export default router;
