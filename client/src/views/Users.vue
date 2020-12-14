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
          <span class="status-indicator st-fix"></span>
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

.status-indicator {
  height: 20px;
  width: 20px;
  background-color: var(--secondary);
  border-radius: 50%;
}

.st-fix {
  position: absolute;
  top: 7%;
  right: 7%;
}

.st-sm {
  display: inline-block;
  height: 10px !important;
  width: 10px !important;
}
</style>