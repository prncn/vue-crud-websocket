<template>
  <div class="PostsComponent">
    <v-container d-flex justify-center>
      <div class="PostsWrapper">
        <Single 
        v-for="post in posts.slice().reverse()" 
        :key="post._id" 
        :post="post"/>
      </div>
    </v-container>
  </div>
</template>

<script>
import Single from '../components/Single';
import { mapState } from 'vuex';

export default {
  name: 'Posts',
  components: {
    Single,
  },
  props: {
    'posts': Array,
  },
  computed: {
    ...mapState([
      // 'posts',
    ]),
  },
}
</script>

<style>
.hide-component {
  display: none;
}
</style>