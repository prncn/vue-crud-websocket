<template>
  <div class="SingleComponent">
    <v-card class="my-2 pa-1" elevation="15" :color="status ? 'primary' : 'white'">
      <v-card-text color="white">
        <v-row></v-row>
        <p class="grey--text">
          {{ `${post.userIP === userIP ? 'Me' : post.userIP} • ${timeSince(post.created_at)}` }}
        </p>
        <p v-if="post.parent" class="d-inline" :class="status ? 'teal--text text--accent-4' : 'primary--text'">
          @{{ this.replyTo }}
        </p>
        <p class="d-inline" :class="status ? 'white--text' : 'grey--text text--darken-3'">
          {{ post.content }}
        </p>
      </v-card-text>
      <v-row class="mx-2">
        <v-btn v-if="post.userIP === userIP" icon @click.prevent="deletePost(post)">
          <v-icon :color="status ? 'white' : 'teal accent-4'">{{ mdiDeleteOutline }}</v-icon>
        </v-btn>
        <v-btn icon @click="routeTo(post)">
          <v-icon :color="status ? 'white' : 'teal accent-4'">{{ mdiCommentProcessingOutline }}</v-icon>
        </v-btn>
        <v-btn icon @click.prevent="likePost(post)">
          <v-icon :color="status ? 'white' : 'teal accent-4'">{{ isLiked ? mdiHeart : mdiHeartOutline }}</v-icon>
        </v-btn>
        <p class="body-2 my-2 font-weight-bold " :class="status ? 'white--text' : 'teal--text text--accent-4'">{{ post.likes }}</p>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import APIService from '../APIService';
import Utility from '../Utility';
import { mapState } from 'vuex';

import { mdiDeleteOutline, mdiHeartOutline } from '@mdi/js';
import { mdiHeart, mdiCommentProcessingOutline } from '@mdi/js';

export default {
  name: "Single",
  props: {
    'post': Object,
    'status': Boolean,
  },
  data: () => ({
    error: '',
    isLiked: false,
    replyTo: '',

    mdiDeleteOutline,
    mdiHeartOutline,
    mdiHeart,
    mdiCommentProcessingOutline,
  }),
  computed: {
    ...mapState([
      'userIP',
      'hasLoaded',
    ]),
  },
  methods: {
    async deletePost(post) {
      await APIService.deletePost(post._id, this.userIP);
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
      // this.$store.commit('DEL_POST', post);
    },

    async likePost(post) {
      if (!post.isLiked) {
        await APIService.likePost(post._id, this.userIP);
        this.$set(post, 'likes', post.likes + 1);
      } else {
        APIService.unlikePost(post._id, this.userIP);
        this.$set(post, 'likes', post.likes - 1);
      }
      post.isLiked = !post.isLiked;
    },

    timeSince(date) {
      return Utility.timeSince(date);
    },

    async getParentIPs(post) {
      let parent = await APIService.findPost(post.parent, {});
      let parentIP = await parent.userIP;
      this.replyTo = parentIP;
    },

    routeTo(post) {
      this.$router.push({ path: `/${post.userIP}/status/${post._id}` });
      // this.$router.go();
    },
  },
  async created() {
    if(this.post.parent){
      this.getParentIPs(this.post)
    }

    const user = await APIService.findUser(this.userIP);
    const likedPosts = await user.liked_posts;
    if(likedPosts.includes(this.post._id)){
      this.isLiked = true;
    }
  },
}
</script>