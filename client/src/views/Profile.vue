<template>
  <div class="Profile">
    <Navbar/>
    <v-row justify="center">
      <h1 class="subheading mr-2">{{ queryIP === userIP ? 'Me' : queryIP }}</h1>
      <v-progress-circular
        v-if="isLoading"
        indeterminate
        color="secondary"
        class="ma-1 px-5"
      ></v-progress-circular>
      <h1 v-else class="subheading primary--text ml-2">
        {{ posts.length }} posts
      </h1>
    </v-row>
    <v-tabs
      centered
      color="primary"
      background-color="grey lighten-5"
      class="my-4"
    >
      <v-tab @click="getPosts('status')">Posts</v-tab>
      <v-tab @click="getLikes()">Likes</v-tab>
      <v-tab @click="getPosts('reply')">Replies</v-tab>
    </v-tabs>
    <Posts :posts="this.allPosts"/>
  </div>
</template>

<script>
import APIService from "../APIService";
import Navbar from "../components/Navbar";
import Posts from "../components/Posts";
import { mapState, mapGetters } from "vuex";

export default {
  name: 'Profile',
  data: () => ({
    tab: '',
    queryIP: '',
		isLoading: true,
		posts: [],
  }),
  components: {
    Posts,
    Navbar,
  },
  computed: {
    ...mapState(['userIP']),
		...mapGetters(['postCount']),
		allPosts: function() {
			return this.posts;
		},		
  },
  methods: {
    async getPosts(type) {
      const sessionUser = await APIService.findUser(this.queryIP);
      const createdIds = await sessionUser.created_posts;
      const likedIds = await sessionUser.liked_posts;

      let posts = [];
      for (let createdId of createdIds) {
        let post = await APIService.findPost(createdId, { type });
        if (typeof post === "object") posts.push(await post);
      }

      for (let post of posts) {
        if (likedIds.includes(post._id)) {
          post.isLiked = true;
        } else {
          post.isLiked = false;
        }
			}
			this.posts = posts;
      // this.$store.commit("SET_POSTS", posts);
      this.isLoading = false;
			return posts;
    },

    async getLikes() {
      const sessionUser = await APIService.findUser(this.queryIP);
      const likedIds = await sessionUser.liked_posts;

      let posts = [];
      for (let likedId of likedIds) {
        let post = await APIService.findPost(likedId, {});
        if (typeof post === 'object') posts.push(await post);
      }

      for (let post of posts) {
        post.isLiked = true;
      }

			this.posts = posts;
      // this.$store.commit("SET_POSTS", posts);
    },
  },
  async created() {
    if(this.$route.path === '/me'){
      this.queryIP = this.userIP;
    } else {
      this.queryIP = this.$route.params.userIP;
    }
    await this.getPosts('status');
  },
};
</script>
