<template>
  <div class="Status">
      <Navbar/>
      <v-container d-flex justify-center>
        <div>
          <Single :post="this.post" status/>
        </div>
      </v-container>

      <v-container>
      <v-form @submit.prevent="createReply(text, 'reply')">
        <v-row justify="center">
          <v-col cols="6" lg="4">
            <v-text-field counter="201" maxlength="201" 
            :placeholder="`Reply to ${ post.userIP }`" 
            outlined 
            v-model="text">
            </v-text-field>
          </v-col>
            <v-btn class="mt-2" 
            color="primary" 
            type="submit" 
            fab dark>
              <v-icon dark>{{ mdiSend }}</v-icon>
            </v-btn>
        </v-row>
      </v-form>
      </v-container>
      <Posts :posts="this.replies"/>
  </div>
</template>

<script>
import APIService from '../APIService';
import Single from '../components/Single'
import Posts from '../components/Posts';
import Navbar from '../components/Navbar';
import { mapState } from 'vuex';

import { mdiDeleteOutline, mdiHeartOutline, mdiSend } from '@mdi/js';
import { mdiHeart, mdiCommentProcessingOutline } from '@mdi/js';

export default {
  name: 'Status',
  components: {
    Navbar,
    Single,
    Posts,
  },
  data: () => ({
    error: '',
    post: '',
    text: '',
    postId: '',
    replies: [],

    mdiDeleteOutline,
    mdiHeartOutline,
    mdiHeart,
    mdiCommentProcessingOutline,
    mdiSend,
  }),
  computed: {
    ...mapState([
      'userIP',
    ]),
  },
  methods: {
    async createReply(content, type) {
      const parentId = this.postId;
      const post = await APIService.createPost(content, type, this.userIP, { parentId });
      // this.$store.commit('ADD_POST', post);
      this.replies.push(post);
      this.text = '';
    },

    async getReplies() {
      const statusPost = await APIService.findPost(this.postId, {});
      const replies = await statusPost.replies;

      let posts = [];
      for(let replyId of replies){
        const reply = await APIService.findPost(replyId, {});
        posts.push(reply);
      }

      this.replies = posts;
    },
  },
  async created() {
      this.postId = this.$route.params.postId;
      const status = await APIService.findPost(this.postId, {});
      this.post = status;

      this.getReplies();
  },
}
</script>

<style scoped>
.theme--light.v-card {
  background-color: var(--primary) !important;
}

.theme--light.v-card > .v-card__text {
  color: white !important;
}

.v-application .teal--text.text--accent-4 {
  color: white !important;
}
</style>