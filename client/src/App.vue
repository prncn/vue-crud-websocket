<template>
  <v-app>
    <transition
      :name="transName"
      :mode="transMode"
    >
      <router-view :key="$route.fullPath" class="transition"/>
    </transition>
  </v-app>
</template>

<script>
import io from 'socket.io-client';
import { mapState } from 'vuex'; 

export default {
  name: 'App',
  data: () => ({
    transName: '',
    transMode: '',
    socket: io.connect('http://localhost:5000'),
  }),
  computed: {
    ...mapState(['socketCount']),
  },
  watch: {
    '$route' (to, from) {
      if(from.name === 'home'){
        this.transMode = 'in-out';
        this.transName = 'router-view';
      } else {
        this.transMode = 'out-in';
        this.transName = 'fade';
      }
    },
    // userCount: function(current) {
    //   this.$store.commit('INCRM_COUNT', current);
    // },
  },
  async created() {
    this.socket.on('connect', function(){ 
      console.log('Client connected..');
    });

    this.socket.on('broadcast', data => {
      console.log('Fired broadcast..');
      console.log(data);
      this.$store.commit('INCRM_COUNT', data);
    })
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Dosis:wght@500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Castoro&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;700&display=swap');

:root {
  --primary: #5f5cff;
  --secondary: #00BFA5;
}

$primary: #5f5cff;
$secondary: #00BFA5;

.v-application, .v-application .body {
  font-family: 'Inter', sans-serif;
}

.theme--light.v-application {
  background-color: #212121;
}

.Dashboard, .Profile, .Status, .Users {
  height: 100%;
  width: 100%;
  background-color: #fafafa;
}

.v-application .title { 
  font-family: 'Montserrat', sans-serif !important;
}

.v-application .display-hero {
  font-family: 'Dosis', sans-serif !important;
}

.v-application .elevation-15 {
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.05), 
  0px 24px 38px 3px rgba(0, 0, 0, 0.03), 
  0px 9px 46px 8px rgba(0, 0, 0, 0.03) !important;
}

.fade-enter, .fade-leave-to {
  opacity: 0.6;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .4s ease;
}

.fixed-page {
  position: fixed;
  width: inherit;
}

/** */
$duration: 0.5s;
.transition {
  overflow: hidden;
}
.router-view,
.router-view-back {
  &-enter-active,
  &-leave-active {
    position: fixed;
    width: 100%;
    background: white;
    min-height: 100vh;
    top: 0;
  }
}
// router view
.router-view-enter-active {
  transition: transform $duration ease-in-out;
  z-index: 2;
  transform: translateY(100%);
}
.router-view-enter-to {
  z-index: 2;
  transform: translateY(0%);
}
.router-view-leave-active {
  z-index: -1;
}
.router-view-leave-to {
  z-index: -1;
}

.v-sheet.v-card {
  width: 500px;
}

@media screen and (max-width: 1000px) {
  .v-sheet.v-card {
    width: 95vw;
  }

  .v-application p {
    margin-bottom: 2px;
  }
}
</style>
