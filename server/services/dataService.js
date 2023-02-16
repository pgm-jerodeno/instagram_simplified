/*
Import packages
*/
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/*
Import custom packages
*/
const { HTTPError, convertArrayToPagedObject } = require('../utils');

/*
File paths
*/
const filePathFollowers = path.join(__dirname, '..', 'data', 'followers.json');
const filePathPosts = path.join(__dirname, '..', 'data', 'posts.json');
const filePathUsers = path.join(__dirname, '..', 'data', 'users.json');

/*
Read and write data
*/
const readDataFromFollowersFile = () => {
  const data = fs.readFileSync(filePathFollowers, { encoding: 'utf8', flag: 'r' });
  const followers = JSON.parse(data);

  return followers;
};

const readDataFromPostsFile = () => {
  const data = fs.readFileSync(filePathPosts, { encoding: 'utf8', flag: 'r' });
  const posts = JSON.parse(data);

  return posts;
};

const readDataFromUsersFile = () => {
  const data = fs.readFileSync(filePathUsers, { encoding: 'utf8', flag: 'r' });
  const users = JSON.parse(data);

  return users;
};

// Todo: Write your CRUD operations

// Users

const getUsers = () => {
  try {
    const users = readDataFromUsersFile();
    return users;
  } catch (error) {
    throw new HTTPError('Can\'t get users!', 500);
  }
};

const getUserById = (userId) => {
  try {
    const users = readDataFromUsersFile();
    const user = users.find(u => u.id === userId);
    return user;
  } catch (error) {
    throw new HTTPError('Can\'t get users!', 500);
  }
};

// Followers

const getFollowers = () => {
  try {
    const followers = readDataFromFollowersFile();
    return followers;
  } catch (error) {
    throw new HTTPError('Can\'t get followers!', 500);
  }
};

const getFollowersForUser = (userId) => {
  try {
    let followers = readDataFromFollowersFile();
    followers = followers.filter(follower => follower.friendId === userId);
    return followers;
  } catch (error) {
    throw new HTTPError(`Can't get followers for user with id ${userId}!`, 500);
  }
};

const getFollowingForUser = (userId) => {
  try {
    let following = readDataFromFollowersFile();
    following = following.filter(follower => follower.userId === userId);
    return following;
  } catch (error) {
    throw new HTTPError(`Can't get followers for user with id ${userId}!`, 500);
  }
};

const addFollower = (follower) => {
  try {
    const followers = readDataFromFollowersFile();
    const followerToAdd = {
      ...follower,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    followers.push(followerToAdd);
    fs.writeFileSync(filePathFollowers, JSON.stringify(followers, null, 2));
    return followerToAdd;
  } catch (error) {
    throw new HTTPError('Can\'t create a new follower!', 501);
  }
};

// Posts

const getPosts = () => {
  try {
    const posts = readDataFromPostsFile();
    return posts;
  } catch (error) {
    throw new HTTPError('Can\'t get posts!', 500);
  }
};

const getPostsForUser = (userId) => {
  try {
    let posts = readDataFromPostsFile();
    posts = posts.filter(post => post.authorId === userId);
    posts = posts.sort((a, b) => {
      if (a.createdAt < b.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt === b.createdAt) return 0;
    });
    return posts;
  } catch (error) {
    throw new HTTPError(`Can't get posts for user with id ${userId}!`, 500);
  }
};

const getPostById = (postId) => {
  try {
    const posts = readDataFromPostsFile();
    const post = posts.find(p => p.id === postId);
    const user = getUserById(post.authorId);
    post.author = user.username;
    post.authorAvatar = user.avatar;
    return post;
  } catch (error) {
    throw new HTTPError(`Can't get post with id ${postId}!`, 500);
  }
};

const getCommentsForPost = (postId) => {
  try {
    const posts = readDataFromPostsFile();
    const post = posts.find(p => p.id === postId);
    let { comments } = post;
    comments.map((comment) => {
      const user = getUserById(comment.userId);
      comment.author = user.username;
      comment.authorAvatar = user.avatar;
    });
    comments = comments.sort((a, b) => {
      if (a.createdAt < b.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt === b.createdAt) return 0;
    });
    return comments;
  } catch (error) {
    throw new HTTPError('Can\'t get comments!', 500);
  }
};

const createPost = (post) => {
  try {
    const posts = readDataFromPostsFile();
    const postToCreate = {
      ...post,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    posts.push(postToCreate);
    fs.writeFileSync(filePathPosts, JSON.stringify(posts, null, 2));
    return postToCreate;
  } catch (error) {
    throw new HTTPError('Can\'t create a new post!', 501);
  }
};

const deletePost = (postId) => {
  try {
    const posts = readDataFromPostsFile();
    const postToRemove = posts.find(p => p.id === postId);
    const postIndex = posts.findIndex(p => p.id === postId);
    posts.splice(postIndex, 1);
    fs.writeFileSync(filePathPosts, JSON.stringify(posts, null, 2));
    return postToRemove;
  } catch (error) {
    throw new HTTPError('Can\'t delete post!', 501);
  }
};

const likePost = (like) => {
  try {
    const posts = readDataFromPostsFile();
    const post = posts.find(p => p.id === like.postId);
    const postIndex = posts.findIndex(p => p.id === like.postId);
    const likeToCreate = {
      userId: like.userId,
      createdAt: Date.now(),
    };
    post.likes.push(likeToCreate);
    posts.splice(postIndex, 1, post);
    fs.writeFileSync(filePathPosts, JSON.stringify(posts, null, 2));
    return likeToCreate;
  } catch (error) {
    throw new HTTPError('Can\'t create a new like!', 501);
  }
};

const unlikePost = (like) => {
  try {
    const posts = readDataFromPostsFile();
    const post = posts.find(p => p.id === like.postId);
    const postIndex = posts.findIndex(p => p.id === like.postId);
    const likeToRemove = post.likes.find(l => l.userId === like.userId);
    const likeIndex = post.likes.findIndex(l => l.userId === like.userId);
    post.likes.splice(likeIndex, 1);
    posts.splice(postIndex, 1, post);
    fs.writeFileSync(filePathPosts, JSON.stringify(posts, null, 2));
    return likeToRemove;
  } catch (error) {
    throw new HTTPError('Can\'t remove like!', 501);
  }
};

// Timeline

const getTimeline = (userId) => {
  try {
    const posts = readDataFromPostsFile();
    let timeline = posts.filter(post => post.authorId === userId);
    let following = readDataFromFollowersFile();
    following = following.filter(follower => follower.userId === userId);
    following.forEach((follower) => {
      timeline.push(posts.filter(post => post.authorId === follower.friendId));
    });
    timeline = timeline.flat(Infinity);
    timeline = timeline.sort((a, b) => {
      if (a.createdAt < b.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt === b.createdAt) return 0;
    });
    timeline = timeline.slice(0, 10);
    timeline = timeline.map(post => getPostById(post.id));
    return timeline;
  } catch (error) {
    throw new HTTPError(`Can't get posts for user with id ${userId}`, 500);
  }
};

// Todo: Export the data services nethods / functions
module.exports = {
  getFollowers,
  getFollowersForUser,
  getFollowingForUser,
  addFollower,
  getPosts,
  getPostsForUser,
  getPostById,
  getCommentsForPost,
  createPost,
  deletePost,
  likePost,
  unlikePost,
  getUsers,
  getUserById,
  getTimeline,
};
