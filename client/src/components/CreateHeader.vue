<template>
    <v-container>
      <v-form @submit.prevent="createPost(text, 'status')">
        <v-row justify="center">
          <v-col cols="6" lg="4">
            <v-text-field 
            counter="201" maxlength="201" 
            class="mt-1" placeholder="What's on your mind..." 
            solo-inverted elevation="15"
            v-model="text"></v-text-field>
          </v-col>
            <v-btn class="mt-2" color="primary" type="submit" fab dark>
              <v-icon dark>{{ mdiSend }}</v-icon>
            </v-btn>
        </v-row>
      </v-form>
    </v-container>
</template>

<script>
import APIService from '../APIService';
import { mapState } from 'vuex';
import { mdiSend } from '@mdi/js';

export default {
name: 'PostsHeader',
data: () => ({
    text: '',
    mdiSend,
}),
computed: {
    ...mapState([
        'userIP',
    ]),
},
methods: {
    async createPost(content, type) {
        const post = await APIService.createPost(content, type, this.userIP);
        this.$store.commit('ADD_POST', post);
        this.text = '';
    },
},

}
</script>
