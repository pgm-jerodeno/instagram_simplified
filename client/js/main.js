(() => {
  const app = {
    init() {
      this.instaApi = new InstaApi();
      this.users = null;
      this.currentUserId = null;
      this.cacheElements();
      this.fetchUsers();
      this.registerListeners();
    },
    cacheElements() {
      this.$profile = document.querySelector('.profile');
      this.$post = document.querySelector('.post');
      this.$newPost = document.querySelector('.newPost');
      this.$formPost = document.querySelector('#formPost');
      this.$userInfo = document.querySelector('.user__info');
      this.$userPosts = document.querySelector('.user__posts');
      this.$timeline = document.querySelector('.timeline');
      this.$followers = document.querySelector('.aside .followers');
      this.$following = document.querySelector('.aside .following');
      this.$addFollower = document.querySelector('.addFollower');
    },
    
    // get a list of all users
    async fetchUsers() {
      this.users = await this.instaApi.getUsers();
      let r = Math.floor(Math.random() * this.users.length);
      this.setActiveUser(this.users[r].id);
      this.getDataForActiveUser(this.currentUserId);
      this.fetchTimeline(this.currentUserId, this.users);
    },

    // set the active user
    setActiveUser(userId) {
      this.currentUserId = userId;
    },

    // get all data for the active user
    async fetchPostsForUser(userId) {
      const posts = await this.instaApi.getPostsForUser(userId);
      return posts;
    },
    async fetchFollowersForUser(userId) {
      const followers = await this.instaApi.getFollowersForUser(userId);
      return followers;
    },
    async fetchFollowingForUser(userId) {
      const following = await this.instaApi.getFollowingForUser(userId);
      return following;
    },
    async getDataForActiveUser(userId) {
      const user = await this.instaApi.getUserById(userId)
      const posts = await this.fetchPostsForUser(userId);
      const followers = await this.fetchFollowersForUser(userId);
      const following = await this.fetchFollowingForUser(userId);
      this.setProfilePicture(user);
      this.renderHTMLForUserInfo(user, posts, followers, following);
      this.renderHTMLForUserPosts(posts);
    },

    // set the profile picture in the header to that of the active user
    setProfilePicture(user) {
      this.$profile.innerHTML = `<a href="profile.html"><img src="${user.avatar}" alt="profile"></a>`;
    },

    // write the html for the section with the user info on the profile page
    renderHTMLForUserInfo(user, posts, followers, following) {
      this.$userInfo.innerHTML = `<div class="profile-picture"><img src="${user.avatar}" alt"${user.username} profile picture"></div>
      <div class="user-details">
        <div class="username">${user.username}</div>
        <div class="postsNr">${posts.length} posts</div>
        <div class="followersNr">${followers.length} followers</div>
        <div class="followingNr">${following.length} following</div>
        <div class="full-name">${user.firstName} ${user.lastName}</div>
      </div>`;
    },

    // write the html for the posts on the profile page
    renderHTMLForUserPosts(posts) {
      posts.forEach((post) => {
        this.$userPosts.innerHTML += `<div class="post" data-id="${post.id}"><img src="${post.picture.small}" alt=""></div>`;
      })
    },

    // get all the data for the timeline of the active user
    async fetchTimeline(userId, users) {
      const timeline = await this.instaApi.getTimeline(userId);
      this.$timeline.innerHTML = this.renderHTMLForTimeline(timeline, userId);
      const followers = await this.fetchFollowersForTimeline(userId);
      this.$followers.innerHTML = this.renderHTMLForFollowers(followers, users);
      const following = await this.fetchFollowingForTimeline(userId);
      this.$following.innerHTML = this.renderHTMLForFollowing(following, users);
    },

    // get the detailed data for a post on the timeline
    async fetchPostById(postId) {
      const post = await this.instaApi.getPostById(postId);
      return post;
    },

    // write the html for the timeline
    renderHTMLForTimeline(posts, userId) {
      let output = '';
      posts.forEach((post) => {
        output += this.renderHTMLForPost(post, userId)
      });
      return output;
    },

    // write the html for a single post on the timeline
    renderHTMLForPost(post, userId) {
      // determine if the post is made by the active user and display a delete button if it is
      let deleteHidden = '';
      if (post.authorId !== userId) {
        deleteHidden = 'hidden'
      };

      // determine if the post is already liked by the active user and display a filled heart if it is
      let likedHidden = '';
      let heartHidden = '';
      if ((post.likes.findIndex(like => like.userId === userId)) === -1) {
        likedHidden = 'hidden';
        heartHidden = '';
      } else {
        likedHidden = '';
        heartHidden = 'hidden';
      };

      // determine how long it has been since the post was created and display the number with an appropriate unit of measure
      const now = Date.now();
      const timeSincePosted = Math.floor((now - post.createdAt) / 1000);
      let timeSincePostedStr = '';
      if(timeSincePosted < 60) {
        timeSincePostedStr = 'A FEW SECONDS';
      } else if(timeSincePosted < 3600) {
        timeSincePostedStr = `${Math.floor(timeSincePosted / 60)} MINUTES`;
      } else if(timeSincePosted < 86400) {
        timeSincePostedStr = `${Math.floor(timeSincePosted / 3600)} HOURS`;
      } else {
        timeSincePostedStr = `${Math.floor(timeSincePosted / 86400)} DAYS`;
      };

      // write the html code for a single post
      let output = `<div class="timeline__post" data-id="${post.id}">
        <div class="post__header">
          <div class="author__details"> 
            <div class="profile-picture"><img src="${post.authorAvatar}"></div>
            <div class="username">${post.author}</div>
          </div>
          <div class="delete ${deleteHidden}">Delete</div>
        </div>
        <div class="post__picture"><img src="${post.picture.large}" alt=""></div>
        <div class="post__details">
          <div class="post__likes">
            <div class="heart ${heartHidden}"><img src="img/heart-regular.svg" alt="like"></div>
            <div class="liked ${likedHidden}"><img src="img/heart-solid.svg" alt="like"></div>
            <div class="likesNr">${post.likes.length} likes</div>
          </div>
          <div class="post__description">
            <span class="author"></span>
            <span class="body">${post.body}</span>
          </div>
          <div class="comments"><p class="comments-header">View all ${post.comments.length} comments</p></div>
          <div class="time-since-posted">${timeSincePostedStr} AGO</div>
        </div>
        <div class="new-comment">
          <form action="#" method="post" id="formComment">
            <input id="comment" type="text" name="newComment" placeholder="Add a comment..."/>
            <button type="submit">Post</button>
          </form>
        </div>
      </div>`;
      return output;
    },

    // write the html to show the comments when clicking on view all ... comments
    renderHTMLForComments(comments) {
      let output = '';

      // determine how long it has been since the comment was created and display the number with an appropriate unit of measure
      const now = Date.now();
      comments.forEach((comment) => {
        const timeSincePosted = Math.floor((now - comment.createdAt) / 1000);
        let timeSincePostedStr = '';
        if(timeSincePosted < 60) {
          timeSincePostedStr = `${Math.floor(timeSincePosted)}s`;
        } else if(timeSincePosted < 3600) {
          timeSincePostedStr = `${Math.floor(timeSincePosted / 60)}m`;
        } else if(timeSincePosted < 86400) {
          timeSincePostedStr = `${Math.floor(timeSincePosted / 3600)}h`;
        } else {
          timeSincePostedStr = `${Math.floor(timeSincePosted / 86400)}d`;
        };

        // write the html code for a comment
        output += `<div class="comment">
          <div class="user-details">
            <div class="profile-picture"><img src="${comment.authorAvatar}" alt=""></div>
            <div class="username">${comment.author}</div>
          </div>
          <div class="comment-body">${comment.body}</div>
          <div class="time-since-posted">${timeSincePostedStr}</div>
        </div>`
      })
      return output;
    },

    // get the data for the side bar of the timeline
    async fetchFollowersForTimeline(userId) {
      let followers = await this.instaApi.getFollowersForUser(userId);
      let r = Math.floor(Math.random() * (followers.length - 4));
      followers = followers.slice(r, r+4);
      return followers;
    },
    async fetchFollowingForTimeline(userId) {
      let following = await this.instaApi.getFollowingForUser(userId);
      let r = Math.floor(Math.random() * (following.length - 4));
      following = following.slice(r, r+4);
      return following;
    },

    // write the html for the side bar of the timeline
    renderHTMLForFollowers(followers, users) {
      let output = '<div class="title">Suggestions</div><div class="subtitle">People you don\'t follow but follow you</div>';
      followers.forEach((follower) => {
        let user = users.find(user => user.id == follower.userId);
        output += `<div class="follower" data-id="${user.id}">
          <div class="follower-details">
            <div class="profile-picture"><img src="${user.avatar}" alt=""></div>
            <div class="username">
              <p>${user.username}</p>
              <p>Following you</p>
            </div>
          </div>
          <div class="addFollower">Follow</div>
        </div>`;
      })
      return output;
    },
    renderHTMLForFollowing(following, users) {
      let output = '<div class="title">Following</div><div class="subtitle">Manage people you follow</div>';
      following.forEach((follower) => {
        let user = users.find(user => user.id == follower.friendId);
        output += `<div class="follower" data-id="${user.id}">
          <div class="follower-details">
            <div class="profile-picture"><img src="${user.avatar}" alt=""></div>
            <div class="username">
              <p>${user.username}</p>
              <p>Following you</p>
            </div>
          </div>
          <div class="removeFollower">Unfollow</div>
        </div>`;
      })
      return output;
    },

    registerListeners() {
      // add listener to show pop-up for new post when click on plus button
      this.$post.addEventListener('click', () => {
        this.$newPost.classList.toggle('hidden');
      });

      // add listener to add new post
      this.$formPost.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        let pictureLink = ev.currentTarget.elements.newPost__picture.value;
        let pictureDescription = ev.currentTarget.elements.newPost__description.value;
        const postToCreate = {
          location: {
            country: "Belgium",
            city: "Oudenaarde",
            street: "Industriepark de Bruwaan 1",
          },
          picture: {
            large: pictureLink,
            small: pictureLink,
          },
          body: pictureDescription,
          authorId: this.currentUserId,
          comments: [],
          likes: [],
        }
        const createdPost = await this.instaApi.addPost(postToCreate);
        this.fetchTimeline(this.currentUserId, this.users);
        this.$newPost.classList.toggle('hidden');
      });

      // add listener to delete a post
      this.$timeline.addEventListener('click', async (ev) => {
        const postId = ev.target.parentNode.parentNode.dataset.id;
        const target = ev.target.classList.value;
        if (target === 'delete ') {
          const deletedPost = await this.instaApi.deletePost(postId);
          this.fetchTimeline(this.currentUserId, this.users);
        }
      });

      // add listener to add follower
      this.$followers.addEventListener('click', async (ev) => {
        const followerId = ev.target.parentNode.dataset.id;
        const followerToAd = {
          userId: this.currentUserId,
          friendId: followerId,
        };
        const target = ev.target.classList.value;
        if (target === 'addFollower') {
          const addedFollower = await this.instaApi.addFollower(followerToAd);
          this.fetchTimeline(this.currentUserId, this.users);
        }
      });

      // add listener to like and unlike a post
      this.$timeline.addEventListener('click', async (ev) => {
        const postId = ev.target.parentNode.parentNode.parentNode.parentNode.dataset.id;
        const target = ev.target.parentNode.classList.value;
        const like = {
          userId: this.currentUserId,
          postId: postId,
        };
        if (target === 'heart ') {
          const addedLike = await this.instaApi.likePost(like);
          ev.target.parentNode.classList.add('hidden');
          ev.target.parentNode.parentNode.querySelector('.liked').classList.remove('hidden');
          this.fetchTimeline(this.currentUserId, this.users);
        } else if (target === 'liked ') {
          const removedLike = await this.instaApi.unlikePost(like);
          ev.target.parentNode.classList.add('hidden');
          ev.target.parentNode.parentNode.querySelector('.heart').classList.remove('hidden');
          this.fetchTimeline(this.currentUserId, this.users);
        }
      });

      // add listener to load comments
      this.$timeline.addEventListener('click', async (ev) => {
        const postId = ev.target.parentNode.parentNode.parentNode.dataset.id;
        const target = ev.target.parentNode.classList.value;
        if (target === 'comments') {
          const comments = await this.instaApi.getCommentsForPost(postId);
          ev.target.parentNode.innerHTML += this.renderHTMLForComments(comments);
        }
      });
    },
  };
  app.init();
})();
