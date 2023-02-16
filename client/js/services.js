const INSTA_BASE_PATH = 'http://localhost:8080/api';

function InstaApi () {
  this.getUsers = async () => {
    try {
      const response = await fetch(`${INSTA_BASE_PATH}/users`);
      const users = await response.json();
      return users;
    } catch (error) {
      console.log(error);
    }
  };

  this.getUserById = async (userId) => {
    try {
      const response = await fetch(`${INSTA_BASE_PATH}/users/${userId}`);
      const user = await response.json();
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  this.getFollowers = async () => {
    try {
      const response = await fetch(`${INSTA_BASE_PATH}/followers`);
      const followers = await response.json();
      return followers;
    } catch (error) {
      console.log(error);
    }
  };
  this.getFollowersForUser = async (userId) => {
    try {
      const response = await fetch(`${INSTA_BASE_PATH}/followers/${userId}`);
      const followers = await response.json();
      return followers;
    } catch (error) {
      console.log(error);
    }
  };
  this.getFollowingForUser = async (userId) => {
    try {
      const response = await fetch(`${INSTA_BASE_PATH}/following/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  this.addFollower = async (follower) => {
    try {
      const body = {
        ...follower
      };

      const response = await fetch(`${INSTA_BASE_PATH}/followers`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  this.getPosts = async () => {
    try {
      const response = await fetch(`${INSTA_BASE_PATH}/posts`);
      const posts = await response.json();
      return posts;
    } catch (error) {
      console.log(error);
    }
  };
  this.getPostsForUser = async (userId) => {
    try {
      const response = await fetch(`${INSTA_BASE_PATH}/users/${userId}/posts`);
      const posts = await response.json();
      return posts;
    } catch (error) {
      console.log(error);
    }
  };
  this.getPostById = async (postId) => {
    try {
      const response = await fetch(`${INSTA_BASE_PATH}/posts/${postId}`);
      const post = await response.json();
      return post;
    } catch (error) {
      console.log(error);
    }
  };
  this.getCommentsForPost = async (postId) => {
    try {
      const response = await fetch(`${INSTA_BASE_PATH}/posts/${postId}/comments`);
      const post = await response.json();
      return post;
    } catch (error) {
      console.log(error);
    }
  };
  this.addPost = async (post) => {
    try {
      const body = {
        ...post
      };

      const response = await fetch(`${INSTA_BASE_PATH}/posts`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  this.deletePost = async (post) => {
    try {
      const body = {
        ...post
      };

      const response = await fetch(`${INSTA_BASE_PATH}/posts/:postId`, {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  this.likePost = async (like) => {
    try {
      const body = {
        ...like
      };

      const response = await fetch(`${INSTA_BASE_PATH}/posts/:postId/likes`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  this.unlikePost = async (like) => {
    try {
      const body = {
        ...like
      };

      const response = await fetch(`${INSTA_BASE_PATH}/posts/:postId/likes`, {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  this.getTimeline = async (userId) => {
    try {
      const response = await fetch(`${INSTA_BASE_PATH}/timeline/${userId}`);
      const posts = await response.json();
      return posts;
    } catch (error) {
      console.log(error);
    }
  };
}