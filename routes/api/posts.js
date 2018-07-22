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

// @route GET api/posts
//@desc Get Post
//@access public route
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({nopostsfound: 'No posts found'}));
});

// @route GET api/posts/:id
//@desc Get Post by id
//@access public route
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({nopostfound: 'No post found with that ID'}));
});

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
