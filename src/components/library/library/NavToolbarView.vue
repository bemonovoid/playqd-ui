<template>
  <v-app-bar dense color="blue-grey lighten-3" fixed flat elevation="0">

    <v-app-bar-nav-icon v-if="this.$route.name === 'LibraryView'" @click="routerGoHome()"></v-app-bar-nav-icon>

    <div v-else class="pl-0 text-left">
      <v-btn plain @click="routerGoBack()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </div>

    <v-toolbar-title>
      <v-btn plain color="white" :disabled="this.$route.name === 'LibraryView'"
             class="text-capitalize" @click="routerGoHome()">Playqd</v-btn>
    </v-toolbar-title>

    <v-spacer/>
    <v-btn icon>
      <v-icon>mdi-account</v-icon>
    </v-btn>


  </v-app-bar>

</template>

<script>

import {eventBus} from "@/main";
import {HTTP_CLIENT} from "@/http/axios-config";

export default {
  name: 'NavToolbarView',
  components: {

  },
  data() {
    return {

    }
  },
  mounted() {
    eventBus.$on('playback-song-ended', (songId) => {
        HTTP_CLIENT.put('/library/history/' + songId);
    });
  },
  methods: {
    routerGoHome() {
      if (this.$route.name !== 'LibraryView') {
        this.$router.push({name: 'LibraryView'})
      }
    },
    routerGoBack() {
      this.$router.back();
    }
  }
}

</script>