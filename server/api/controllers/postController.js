/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const { handleHTTPError } = require('../../utils');

// Todo: Write your controllers end-points

const getPosts = (req, res, next) => {
  try {
    // Get posts from dataService
    const posts = dataService.getPosts();
    // send response
    res.status(200).json(posts);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

const getPostsForUser = (req, res, next) => {
  try {
    // get userId parameter
    const { userId } = req.params;
    // Get posts from dataService
    const posts = dataService.getPostsForUser(userId);
    // send response
    res.status(200).json(posts);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

const getPostById = (req, res, next) => {
  try {
    // get postId parameter
    const { postId } = req.params;
    // Get post from dataService
    const post = dataService.getPostById(postId);
    // send response
    res.status(200).json(post);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

const getCommentsForPost = (req, res, next) => {
  try {
    // get postId parameter
    const { postId } = req.params;
    // Get post from dataService
    const comments = dataService.getCommentsForPost(postId);
    // send response
    res.status(200).json(comments);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

const createPost = (req, res, next) => {
  try {
    const post = req.body;
    const createdPost = dataService.createPost(post);
    res.status(201).json(createdPost);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

const deletePost = (req, res, next) => {
  try {
    const { postId } = req.params;
    const deletedPost = dataService.deletePost(postId);
    res.status(201).json(deletedPost);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

const likePost = (req, res, next) => {
  try {
    const like = req.body;
    const createdLike = dataService.likePost(like);
    res.status(201).json(createdLike);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

const unlikePost = (req, res, next) => {
  try {
    const like = req.body;
    const removedLike = dataService.unlikePost(like);
    res.status(201).json(removedLike);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

// Todo: Export the end-points
module.exports = {
  getPosts,
  getPostsForUser,
  getPostById,
  getCommentsForPost,
  createPost,
  deletePost,
  likePost,
  unlikePost,
};
