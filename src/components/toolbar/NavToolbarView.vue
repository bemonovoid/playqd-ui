<template>
  <div>
    <v-app-bar app dense color="#3EA055" fixed flat elevation="0">

      <v-app-bar-nav-icon v-if="this.$route.name === 'LibraryView'" @click="navDrawer = true"></v-app-bar-nav-icon>

      <div v-else class="pl-0 text-left">
        <v-btn plain @click="routerGoBack()">
          <v-icon color="white">mdi-arrow-left</v-icon>
        </v-btn>
      </div>

      <v-toolbar-title>
        <v-btn plain color="white"
               class="text-capitalize" @click="routerGoHome()">Playqd</v-btn>
      </v-toolbar-title>

      <v-spacer/>

      <v-menu bottom left offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon color="white">mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item :to="{name: 'LibrarySettingsView'}">
            <v-list-item-title>Preferences</v-list-item-title>
            <v-list-item-icon>
              <v-icon small>mdi-cog-outline</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-app-bar>

  </div>

</template>

<script>

import {eventBus} from "@/main";
import api from "@/http/playqdAPI";

export default {
  name: 'NavToolbarView',
  data () {
    return {
      navDrawer: false,
      group: null
    }
  },
  mounted() {
    eventBus.$on('playback-song-ended', (songId) => {
      api.updatePlayedSongCount(songId);
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