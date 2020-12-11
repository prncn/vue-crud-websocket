<template>
  <div class="Users">
    <Navbar/>
    <v-container d-flex justify-center align-center>
      <div v-for="user in allUsers" :key="user._id">
        <div class="avatar-wrapper ma-5" style="cursor: pointer;">
          <v-avatar size="120" class="mb-5 outlined" @click.stop="routeTo(user)">
            <img :src="fetchImage(user.icon)">
          </v-avatar>
          <p class="primary--text">{{ user.userIP }}</p>
          <span class="status-indic"></span>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import APIService from '../APIService';
import Navbar from '../components/Navbar.vue';

export default {
  name: 'Users',
  components: { 
    Navbar,
  },
  data: () => ({
    allUsers: [],
  }),
  methods: {
    fetchImage(icon) {
      return require(`@/assets/avatar-icons/av-icon-${icon}.jpg`);
    },
    routeTo(user) {
      this.$router.push({ path: `/${user.userIP}` });
    }
  },
  async created() {
    const allUsers = await APIService.getUsers();
    this.allUsers = allUsers;
  }
}
</script>

<style>
.avatar-wrapper {
  position: relative;
}

.status-indic {
  height: 20px;
  width: 20px;
  background-color: var(--secondary);
  border-radius: 50%;
  position: absolute;
  top: 7%;
  right: 7%;
}
</style>