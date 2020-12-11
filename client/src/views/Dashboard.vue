<template>
  <div class="Dashboard">
    <Navbar />
    <CreateHeader />
    <v-row justify="center">
      <h1 class="subheading mr-2">Dashboard</h1>
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
    <Posts :posts="this.posts"/>
  </div>
</template>

<script>
import Navbar from "../components/Navbar";
import Posts from "../components/Posts";
import CreateHeader from "../components/CreateHeader";
import APIService from "../APIService";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Dashboard",
  components: {
    Navbar,
    Posts,
    CreateHeader,
  },
  data: () => ({
    isLoading: true,
    posts: [],
  }),
  computed: {
    ...mapState(['userIP', 'newPost']),
    ...mapGetters(['postCount']),
  },
  watch: {
    newPost(newData) {
      console.log('Posting...');
      this.posts.push(newData);
    }
  },
  methods: {
    async setPosts() {
      const posts = await APIService.getPosts({});
      const sessionUser = await APIService.findUser(this.userIP);
      const likedPosts = await sessionUser.liked_posts;

      for (let post of posts) {
        if (likedPosts.includes(post._id)) {
          post.isLiked = true;
        } else {
          post.isLiked = false;
        }
      }

      this.posts = posts;
      // this.$store.commit("SET_POSTS", posts);
      this.isLoading = false;
    },
  },
  async created() {
    // const PostsComponent = document.getElementsByClassName("PostsComponent")[0];
    // if (PostsComponent) PostsComponent.classList.add("hide-component");
    await this.setPosts();
    const user = await APIService.findUser(this.userIP);
    this.$store.commit('GET_ICON', user);
    // document
    //   .getElementsByClassName("PostsComponent")[0]
    //   .classList.remove("hide-component");
  },
};
</script>
