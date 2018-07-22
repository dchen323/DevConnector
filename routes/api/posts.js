import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import passport from 'passport';

//Load post and user model
import Post from '../../models/Post';
import Profile from '../../models/Profile';

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

// @route DELETE api/posts/:id
//@desc Delete Post
//@access private route
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if(post.user.toString() !== req.user.id){
            return res.status(401).json({ notauthorized: 'User not authorized'});
          }

          //Delete post
          post.remove().then( () => res.json({ success: true}));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
    });
});

// @route POST api/posts/like/:id
//@desc Like Post
//@access private route
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({ alreadyliked: 'User already liked this post'});
          }

          //Add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
    });
});

// @route DELETE api/posts/like/:id
//@desc Unlike Post
//@access private route
router.delete('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({ notliked: 'You have not liked this post'});
          }

          //Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          //splice out of array
          post.likes.splice(removeIndex, 1);

          //save post
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
    });
});

export default router;
