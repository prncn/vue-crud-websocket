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
        dark 
        class="ma-10 action-bottom upper"
        @click.prevent="auth()"
      >
        Connect
      </v-btn>

      <transition name="fade">
        <v-btn
          v-if="this.proceed"
          icon
          large
          color="white"
          class="ma-10 action-bottom"
          to="/dash"
        >
          <v-icon large>{{ mdiChevronDown }}</v-icon>
        </v-btn>
      </transition>
    </v-container>
  </div>
</template>

<script>
import { mdiChevronDown } from "@mdi/js";
import APIService from "../APIService";

export default {
  name: "Home",
  data: () => ({
    mdiChevronDown,
    proceed: false,
  }),
  methods: {
    async auth() {
      const sessionIP = await APIService.getSessionIP();
      const user = await APIService.findUser(sessionIP);

      if (!user) {
        await APIService.createUser(sessionIP);
      }
      localStorage.setItem('user_token', sessionIP);
      this.proceed = true;
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
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  top: -1rem;
  width: 45rem;
  z-index: -1;
}

@media screen and (max-width: 1000px) {
  .hero-img {
    top: -5rem;
    width: 40rem;
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

.upper {
  bottom: 5rem !important;
}

fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
