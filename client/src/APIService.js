const axios = require('axios');
const posts_uri = 'http://localhost:5000/api/posts/';
const users_uri = 'http://localhost:5000/api/users/';


class APIService {
  static async getSessionIP() {
    const uri = 'http://www.geoplugin.net/json.gp';
    const data = await axios(uri);
    return data.data.geoplugin_request;
  }

  /**
   * Posts API
   */
  static async getPosts(query) {
    try {
      let query_uri = 'api/posts';
      if (query.limit) {
        query_uri += `?limit=${query.limit}`;
      }
      if (query.offset) {
        query_uri += `&offset=${query.offset}`;
      }
      const posts = await axios(query_uri);
      const data = await posts.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async findPost(id, option) {
    try {
      let query_uri = `${posts_uri}${id}`;
      if (option.type) {
        query_uri += `?type=${option.type}`;
      }
      const post = await axios(query_uri);
      const data = post.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async createPost(content, type, userIP, options) {
    const post = await axios.post(posts_uri, {
      type,
      content,
      userIP,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await post.data;
    await this.pushPostUser(data._id, userIP, 'created_post');

    if (type === 'reply') {
      await this.pushReplyPost(options.parentId, data._id);
    }

    return data;
  }

  static async pushReplyPost(postId, replyId) {
    console.log(postId, replyId)
    await axios.put(`${posts_uri}${postId}/reply`, {
      replyId,
    });
  }

  static async pullReplyPost(postId, replyId) {
    console.log(postId, replyId)
    await axios.delete(`${posts_uri}${postId}/reply`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        replyId,
      },
    });
  }

  static async pushPostUser(data, userIP, field) {
    if (field === 'created_post') {
      await axios.put(`${users_uri}${userIP}/posts`, {
        created_post: data,
      });
    }
    if (field === 'liked_post') {
      await axios.put(`${users_uri}${userIP}/posts`, {
        liked_post: data,
      });
    }
  }

  static async pullPostUser(data, userIP, field) {
    if (field === 'created_post') {
      await axios.delete(`${users_uri}${userIP}/posts`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          created_post: data,
          liked_post: data,
        }
      });
    }
    if (field === 'liked_post') {
      console.log(data, userIP, field, 'string');
      await axios.delete(`${users_uri}${userIP}/posts`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          liked_post: data,
        }
      });
    }
  }

  static async likePost(id, userIP) {
    const user = await this.findUser(userIP);
    const likedPosts = await user.liked_post;
    if(likedPosts.includes(id)) return false;

    await axios.patch(`${posts_uri}${id}/like`);
    await this.pushPostUser(id, userIP, 'liked_post');
  }

  static async unlikePost(id, userIP) {
    await axios.patch(`${posts_uri}${id}/unlike`);
    await this.pullPostUser(id, userIP, 'liked_post');
  }

  static async deletePost(id, userIP) {
    const toDelete = await this.findPost(id, {});

    await this.pullPostUser(id, userIP, 'created_post');
    await this.pullPostUser(id, userIP, 'liked_post');

    if (toDelete.type === 'reply') {
      const parentId = await toDelete.parent;
      await this.pullReplyPost(parentId, id);
    }
    await axios.delete(`${posts_uri}${id}`);
  }

  /**
   * Users API
   */
  static async getUsers() {
    try {
      const users = await axios(users_uri);
      const data = await users.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async createUser(userIP) {
    console.log('Creating new User...');
    return axios.post(users_uri, {
      userIP,
    });
  }

  static async findUser(userIP) {
    let user = await axios(`${users_uri}${userIP}`);
    user = await user.data;
    if (!user) return false;

    console.log('User found.');
    return user;
  }

  static deleteUser(id) {
    return axios.delete(`${users_uri}${id}`);
  }
}

export default APIService;