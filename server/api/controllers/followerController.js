/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const { handleHTTPError } = require('../../utils');

// Todo: Write your controllers end-points
const getFollowers = (req, res, next) => {
  try {
    // Get followers from dataService
    const followers = dataService.getFollowers();
    // send response
    res.status(200).json(followers);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

const getFollowersForUser = (req, res, next) => {
  try {
    // get userIs parameter
    const { userId } = req.params;
    // Get followers from dataService
    const followers = dataService.getFollowersForUser(userId);
    // send response
    res.status(200).json(followers);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

const getFollowingForUser = (req, res, next) => {
  try {
    // get userIs parameter
    const { userId } = req.params;
    // Get followers from dataService
    const followers = dataService.getFollowingForUser(userId);
    // send response
    res.status(200).json(followers);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

const addFollower = (req, res, next) => {
  try {
    const follower = req.body;
    const addedFollower = dataService.addFollower(follower);
    res.status(201).json(addedFollower);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

// Todo: Export the end-points
module.exports = {
  getFollowers,
  getFollowersForUser,
  getFollowingForUser,
  addFollower,
};
