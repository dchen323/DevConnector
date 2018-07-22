import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import passport from 'passport';

//Load post model
import Post from '../../models/Post';

//Load post validation
import validatePostInput from '../../validation/post';

// @route GET api/posts/test
//@desc Tests posts route
//@access public route
router.get('/test', (req, res) => res.json({msg: "Posts Works"}));

// @route POST api/posts
//@desc Create Post
//@access private route
router.post('/', passport.authenticate('jwt', { session: false }), (req,res) => {
  const { errors, isValid } = validatePostInput(req.body);

  //check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save()
    .then(post => res.json(post));
});

export default router;
