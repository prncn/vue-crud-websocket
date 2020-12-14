<template>
  <nav>
    <v-toolbar flat height="100" class="px-10 blue grey lighten-5">
      <v-toolbar-title class="font-weight-bold title ml-15"
        >canister</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click.stop="switchDraw()"></v-app-bar-nav-icon>
      <div>{{ time }}</div>
    </v-toolbar>

    <v-navigation-drawer
      permanent
      :fixed="true"
      :mini-variant.sync="drawer"
      mini-variant-width="5rem"
      dark
      class="black pa-7"
      width="20rem"
    >
      <v-row class="mb-4 mt-2 mx-4" v-if="!drawer">
        <h2 class="font-weight-bold title white--text pr-5">canister</h2>
        <p class="text-caption grey--text mt-1">logged in as {{ userIP }}</p>
      </v-row>
      <v-list flat class="text-h4 font-weight-bold" nav>
        <v-avatar v-if="!drawer" size="120" class="mb-5 outlined">
          <img :src="fetchImage" />
        </v-avatar>

        <v-list-item-group v-model="group" active-class="primary--text">
          <v-list-item
            v-for="(route, index) in routes"
            :key="index"
            :to="route.link"
            active-class="primary--text"
          >
            <v-list-item-icon>
              <v-icon>{{ route.icon }}</v-icon>
            </v-list-item-icon>

            <v-hover v-slot:default="{ hover }">
              <v-list-item-title
                class="body"
                :class="hover ? 'primary--text' : ''"
                >{{ route.text }}</v-list-item-title
              >
            </v-hover>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <p class="text-caption grey--text mt-1">
        <span class="st-sm status-indicator mx-3"></span
        >{{ socketCount }} currently online.
      </p>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { mapState } from "vuex";
import APIService from "../APIService";

export default {
  data: () => ({
    time: "",
    drawer: false,
    group: null,
    routes: [
      { link: "/", text: "Home", icon: "mdi-home-variant" },
      { link: "/dash", text: "Dashboard", icon: "mdi-view-dashboard" },
      { link: "/users", text: "Users", icon: "mdi-account-multiple" },
      { link: "/me", text: "Profile", icon: "mdi-forum" },
    ],
  }),
  computed: {
    ...mapState(["userIP", "userIcon", "socketCount"]),
    fetchImage() {
      if (!this.userIcon) return;
      const fileName = this.userIcon;
      return require(`../assets/avatar-icons/av-icon-${fileName}.jpg`);
    },
  },
  watch: {
    group() {
      this.drawer = false;
      this.hover = false;
    },
  },
  methods: {
    switchDraw() {
      this.drawer = !this.drawer;
    },
  },
  async created() {
    this.time = new Date().toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "numeric",
    });
    if (!this.userIcon) {
      const user = await APIService.findUser(this.userIP);
      this.$store.commit("GET_ICON", user);
    }
  },
};
</script>

<style lang="scss">
.overlay-closer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.on-hover {
  color: var(--primary) !important;
}

.subtitle-2 {
  font-family: "Inter", sans-serif !important;
}

.v-avatar.outlined {
  border: 4px solid var(--secondary);
  border-radius: 50%;
}
</style>
