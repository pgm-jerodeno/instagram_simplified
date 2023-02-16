/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const { handleHTTPError } = require('../../utils');

// Todo: Write your controllers end-points

const getUsers = (req, res, next) => {
  try {
    // Get users from dataService
    const users = dataService.getUsers();
    // send response
    res.status(200).json(users);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

const getUserById = (req, res, next) => {
  try {
    // get postId parameter
    const { userId } = req.params;
    // Get users from dataService
    const user = dataService.getUserById(userId);
    // send response
    res.status(200).json(user);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

// Todo: Export the end-points
module.exports = {
  getUsers,
  getUserById,
};
