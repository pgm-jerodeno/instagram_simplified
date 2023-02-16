/*
Import packages
*/
const express = require('express');

/*
Import custom packages
*/
const followerController = require('../controllers/followerController');
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');
const timelineController = require('../controllers/timelineController');

/*
Make a router
*/
const router = express.Router();

/*
Routes
*/

// Followers
router.get('/followers', followerController.getFollowers);
router.get('/followers/:userId', followerController.getFollowersForUser);
router.get('/following/:userId', followerController.getFollowingForUser);
router.post('/followers', followerController.addFollower);

// Posts
router.get('/posts', postController.getPosts);
router.get('/users/:userId/posts', postController.getPostsForUser);
router.get('/posts/:postId', postController.getPostById);
router.get('/posts/:postId/comments', postController.getCommentsForPost);
router.post('/posts', postController.createPost);
router.delete('/posts/:postId', postController.deletePost);
router.post('/posts/:postId/likes', postController.likePost);
router.delete('/posts/:postId/likes', postController.unlikePost);

// Users
router.get('/users', userController.getUsers);
router.get('/users/:userId', userController.getUserById);

// Timeline
router.get('/timeline/:userId', timelineController.getTimeline);

// Todo: Write your end-points: url in combination with action methods from corresponding controllers

module.exports = router;
