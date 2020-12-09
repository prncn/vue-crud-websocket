<template>
  <nav @click.stop="drawer = false">
    <v-toolbar flat height="100" class="px-10 blue grey lighten-5">
      <v-toolbar-title class="font-weight-bold title">canister</v-toolbar-title>
      <v-toolbar-title class="title px-5 subtitle-2 grey--text">logged in as {{ userIP }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon large class="black--text text-h1" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" :fixed="true" permanent style="position: fixed" dark class="black pa-7"
      width="30rem">
      <v-row class="mb-4 mt-2 mx-4">
        <h2 class="font-weight-bold title white--text ">canister</h2>
        <p class="subtitle-2 grey--text pl-5 mt-1">logged in as {{ userIP }}</p>
      </v-row>
      <v-list flat class="text-h4 font-weight-bold" nav>
        <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
          <v-list-item v-for="(route, index) in routes" :key="index" :to="route.link" active-class="deep-purple--text text--accent-4">
            <v-hover v-slot:default="{ hover }">
              <v-list-item-title :class="hover ? 'primary--text' : 'white--text'">{{ route.text }}</v-list-item-title>
            </v-hover>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
  export default {
    data: () => ({
      userIP: localStorage.getItem('user_token'),
      drawer: true,
      group: null,
      routes : [
        { link: '/', text: 'Home'},
        { link: '/dash', text: 'Dashboard'},
        { link: '/users', text: 'Users'},
        { link: '/me', text: 'Profile'},
      ]
    }),
    watch: {
      group () {
        this.drawer = false;
        this.hover = false;
      },
    },
  }
</script>

<style scoped>
.overlay-closer {
  position: absolute;
  width: 100%; 
  height: 100%; 
}

.on-hover {
  color: var(--primary) !important;
}

.subtitle-2 {
  font-family: 'Inter', sans-serif !important;
}

</style>