import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        posts: [],
        userIP: localStorage.getItem('user_token'),
        hasLoaded: false,
    },
    mutations: {
        SET_POSTS: (state, posts) => (state.posts = posts.slice().reverse()),
        ADD_POST: (state, post) => state.posts.unshift(post),
        DEL_POST: (state, post) => state.posts.splice(state.posts.indexOf(post), 1),
        LOADED: state => state.hasLoaded = true, 
    },
    getters: {
        allPosts: state => state.posts,
        postCount: state => state.posts.length,
    },
});
