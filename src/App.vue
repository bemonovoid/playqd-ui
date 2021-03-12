<template>
  <v-app class="grey lighten-4">
    <NavToolbarView/>
    <v-main>
      <v-container>
        <Audio/>
        <v-row>
          <v-col md="6" offset-md="3">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <transition>
      <div v-show="this.$store.state.miniPlayer.show">
        <MiniPlayerView></MiniPlayerView>
      </div>
    </transition>
  </v-app>
</template>

<script>

import store from "@/store/vuex-store";

import {eventBus} from "@/main";

import Audio from "@/components/audio/Audio";

import NavToolbarView from "@/components/library/library/NavToolbarView";
import MiniPlayerView from "@/components/library/miniplayer/MiniPlayerView";

export default {
  name: 'App',
  store: store,
  components: {
    Audio,
    NavToolbarView,
    MiniPlayerView
  },
  mounted() {
    eventBus.$on('song-is-ready-to-play', () => {
      this.appTitle.inner = this.$store.state.playlist.currentSong.artist.name;
      this.appTitle.complement = this.$store.state.playlist.currentSong.name;
      this.$emit('updateHead');

      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = this.$store.getters.getResourceBaseUrl + 'image/?resourceId=' + this.$store.state.playlist.currentSong.album.resourceId;

    });
  },
  data() {
    return {
      appTitle: {
        inner: 'Playqd',
        complement: 'local music player'
      }
    }
  },
  head: {
    title() {
      return {
        complement: this.appTitle.complement,
        inner: this.appTitle.inner,
        separator: ' - '
      }
    }
  }
}

</script>
