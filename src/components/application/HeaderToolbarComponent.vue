<template>
  <div>
    <v-app-bar app dark fixed flat elevation="1">

      <v-toolbar-title>
        <v-btn plain class="text-capitalize" @click="routerGoHome()">Playqd</v-btn>
        </v-toolbar-title>

      <v-spacer/>

      <v-menu bottom left offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-account</v-icon>
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

import SearchComponent from "@/components/application/NavToolbarComponent";

export default {
  name: 'HeaderToolbarComponent',
  components: {SearchComponent},
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