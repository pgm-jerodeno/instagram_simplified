/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const { handleHTTPError } = require('../../utils');

// Todo: Write your controllers end-points

const getTimeline = (req, res, next) => {
  try {
    // get userId parameter
    const { userId } = req.params;
    // Get posts from dataService
    const posts = dataService.getTimeline(userId);
    // send response
    res.status(200).json(posts);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

// Todo: Export the end-points
module.exports = {
  getTimeline,
};
