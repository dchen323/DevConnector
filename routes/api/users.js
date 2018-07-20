const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

// @route GET api/users/test
//@desc Tests posts route
//@access public route
router.get('/test', (req, res) => res.json({msg: "Users Works"}));

// @route GET api/users/register
//@desc Register user
//@access public route
router.post('/register', (req, res) => {
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
            res.json({msg: 'Success'});
          }else{
            return res.status(400).json({password: 'Incorrect username/password'});
          }
        });
    });
});


module.exports = router;
