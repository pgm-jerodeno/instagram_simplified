/*
Import packages
*/
const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

/*
File paths
*/
const filePathPosts = path.join(__dirname, '..', 'data', 'posts.json');
const filePathUsers = path.join(__dirname, '..', 'data', 'users.json');
const filePathFollowers = path.join(__dirname, '..', 'data', 'followers.json');

/*
Create users
*/
const createRandomUser = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const registeredAt = new Date(faker.date.past()).getTime();

  return {
    id: uuidv4(),
    username: faker.internet.userName(firstName, lastName),
    password: 'w84pgm2beGr8',
    email: faker.internet.email(firstName, lastName),
    avatar: faker.image.avatar(),
    firstName,
    lastName,
    gender: faker.name.gender(),
    dayOfBirth: faker.date.birthdate(),
    address: {
      country: faker.address.country(),
      city: faker.address.city(),
      street: faker.address.streetAddress(),
    },
    registeredAt,
    updatedAt: new Date(registeredAt + Math.round((1000 * 60 * 60 * 24) * Math.random() * 365)).getTime(),
  };
};

const createUsers = async (amount = 40) => {
  const users = [];

  for (let i = 0; i < amount; i++) {
    users.push(createRandomUser());
  }

  return Promise.resolve(users);
};

/*
Create comments
*/
const createComment = (userId) => {
  const createdAt = new Date(faker.date.past()).getTime();

  return {
    id: uuidv4(),
    userId,
    body: faker.lorem.paragraphs(1 + Math.round(Math.random() * 3)),
    createdAt,
    updatedAt: new Date(createdAt + Math.round((1000 * 60 * 60 * 24) * Math.random() * 60)).getTime(),
  };
};

const createComments = async (users, amount = 10) => {
  const comments = [];

  for (let i = 0; i < amount; i++) {
    const userId = users[Math.floor(Math.random() * users.length)].id;
    comments.push(createComment(userId));
  }

  return Promise.resolve(comments);
};

/*
Create comments
*/
const createLike = (userId) => {
  const createdAt = new Date(faker.date.past()).getTime();

  return {
    userId,
    createdAt,
  };
};

const createLikes = async (users, authorId, amount = 10) => {
  const likes = [];
  const usersTrimmed = users.filter(user => user.id !== authorId);

  for (let i = 0; i < amount; i++) {
    const userId = usersTrimmed.splice(Math.floor(Math.random() * usersTrimmed.length), 1)[0].id;
    likes.push(createLike(userId));
  }

  return Promise.resolve(likes);
};

/*
Create posts
*/
const createPost = async (users, authorId) => {
  const createdAt = new Date(faker.date.past(6)).getTime();
  const comments = await createComments(users, Math.round(Math.random() * 60));
  const likes = await createLikes(users, authorId, 16 + Math.floor(Math.random() * (users.length - 16)));
  const pictureId = Math.round(Math.random() * 1000);
  const maxHeight = 1200 + Math.round(Math.random() * 1200);
  const minHeight = 400 + Math.round(Math.random() * 200);
  const ratio = 0.5 + Math.random();

  return {
    id: uuidv4(),
    location: {
      country: faker.address.country(),
      city: faker.address.city(),
      street: faker.address.streetAddress(),
    },
    picture: {
      large: `https://picsum.photos/id/${pictureId}/${Math.round(maxHeight * ratio)}/${maxHeight}.jpg`,
      small: `https://picsum.photos/id/${pictureId}/${Math.round(minHeight * ratio)}/${minHeight}.jpg`,
    },
    body: faker.lorem.paragraphs(1 + Math.round(Math.random() * 3)),
    authorId,
    comments,
    likes,
    createdAt,
    updatedAt: new Date(createdAt + Math.round((1000 * 60 * 60 * 24) * Math.random() * 60)).getTime(),
  };
};

const createPosts = async (users, amount = 160) => {
  const posts = [];

  for (let i = 0; i < amount; i++) {
    posts.push(await createPost(users, users[Math.floor(Math.random() * users.length)].id));
  }

  return Promise.resolve(posts);
};

/*
Create follower
*/
const createFollower = (userId, friendId) => {
  const createdAt = new Date(faker.date.past()).getTime();

  return {
    id: uuidv4(),
    userId,
    friendId,
    createdAt,
  };
};

const createFollowers = async (users) => {
  const followers = [];

  let userId;
  let friendId;
  let filteredUsers;
  let amount;

  for (let user of users) {
    amount = Math.floor(Math.random() * (users.length - 1));
    userId = user.id;
    filteredUsers = users.filter(user => user.id !== userId);

    console.log(userId);

    for (let i = 0; i < amount; i++) {
      friendId = filteredUsers.splice(Math.floor(Math.random() * filteredUsers.length), 1)[0].id;
      followers.push(createFollower(userId, friendId));
    }
  }
  return Promise.resolve(followers);
};

const seed = async () => {
  const users = await createUsers(50);
  fs.writeFileSync(filePathUsers, JSON.stringify(users, null, 2));
  const posts = await createPosts(users, 1200);
  fs.writeFileSync(filePathPosts, JSON.stringify(posts, null, 2));
  const followers = await createFollowers(users);
  fs.writeFileSync(filePathFollowers, JSON.stringify(followers, null, 2));
};

seed();
