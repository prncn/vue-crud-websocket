<template>
  <div class="Home fixed-page">
    <v-container justify-center align-center fill-height>
      <img class="hero-img" src="../assets/psd_cosyantlers.png" />
      <div
        class="white--text text-h1 display-hero font-weight-bold text-uppercase"
      >
        Canister.
      </div>
      <v-btn
        icon
        large
        color="white"
        class="ma-10 action-bottom"
        @click.prevent="auth()"
      >
        <v-icon large>{{ mdiChevronDown }}</v-icon>
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import { mdiChevronDown } from "@mdi/js";
import APIService from "../APIService";
import router from "../router";

export default {
  name: "Home",
  data: () => ({
    mdiChevronDown,
  }),
  methods: {
    async auth() {
      const sessionIP = await APIService.getSessionIP();
      const user = await APIService.findUser(sessionIP);

      if (!user) {
        await APIService.createUser(sessionIP);
      }
      localStorage.setItem("user_token", sessionIP);
      router.push("dash");
    },
  },
};
</script>

<style scoped>
.Home {
  height: 100%;
  width: 100%;
  background-color: #5f5cff;
}

.hero-img {
  position: absolute;
  right: 0;
  top: 10px;
  width: 50%;
  z-index: -1;
}

@media screen and (max-width: 500px) {
  .hero-img {
    width: 100%;
  }

  .text-h1 {
    font-size: 5.5em !important;
  }
}

.action-bottom {
  position: absolute;
  bottom: 1.25rem;
  margin: auto;
}
</style>
