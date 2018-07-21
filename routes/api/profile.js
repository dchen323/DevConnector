import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
const router = express.Router();

//Load profile and user model
import Profile from '../../models/Profile';
import User from '../../models/User';

// @route GET api/profile/test
//@desc Tests posts route
//@access public route
router.get('/test', (req, res) => res.json({msg: "Profile Works"}));

// @route GET api/profile
//@desc Get current users profile
//@access private route
router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});


export default router;
