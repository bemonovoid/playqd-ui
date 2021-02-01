<template>
  <v-app class="grey lighten-4">
    <NavToolbarView/>
    <v-main>
      <v-container>
        <Audio/>
        <v-row class="pt-10">
          <v-col md="6" offset-md="3">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <MiniPlayerView></MiniPlayerView>
  </v-app>
</template>

<script>

import store from "@/store/vuex-store";
import Vue from 'vue'
import VueRouter from "vue-router";

import {eventBus} from "@/main";

import Audio from "@/components/audio/Audio";

import NavToolbarView from "@/components/library/library/NavToolbarView";
import MiniPlayerView from "@/components/library/miniplayer/MiniPlayerView";
import PlayerView from "@/components/library/player/PlayerView";

import LibraryView from "@/components/library/library/LibraryView";
import GenresView from "@/components/library/genres/GenresView";
import ArtistsView from "@/components/library/artists/ArtistsView";
import AlbumsView from "@/components/library/albums/AlbumsView"
import SongsView from "@/components/library/songs/SongsView";

const routes = [
  { path: '/', alias: ['/home', '/index.html'], name: 'Home', component: LibraryView, meta: {title: 'Home'} },
  { path: '/library', name: 'LibraryView', component: LibraryView, meta: {title: 'Library'} },
  { path: '/library/artists', name: 'ArtistsView', component: ArtistsView, meta: {title: 'Artists'} },
  { path: '/library/genres', name: 'GenresView', component: GenresView, meta: {title: 'Genres'} },
  { path: '/library/albums', name: 'AlbumsView', component: AlbumsView, props: route => ({artistId: route.query.artistId, genre: route.query.genre}), meta: {title: 'Albums'} },
  { path: '/library/artists/albums/:albumId', name: 'SongsView', component: SongsView, meta: {title: 'Songs'} },
  { path: '/library/player/:songId', name: 'PlayerView', component: PlayerView, meta: {title: 'Player'} }
]

const router = new VueRouter({
  routes
});

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    // PAGE_TITLE_UTILS.setPageTitle(to.meta.title);
  })
})

export default {
  name: 'App',
  store: store,
  router: router,
  components: {
    Audio,
    NavToolbarView,
    MiniPlayerView,
    PlayerView,
    LibraryView,
    GenresView,
    ArtistsView,
    AlbumsView,
    SongsView
  },
  created() {
    eventBus.$on('song-is-ready-to-play', () => {
      this.appTitle.inner = this.$store.state.playlist.currentSong.artist.name;
      this.appTitle.complement = this.$store.state.playlist.currentSong.name;
      // this.artwork = this.$store.state.artwork.ofCurrentSong;
      this.$emit('updateHead');


      var link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = this.$store.state.artwork.ofCurrentSong;

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
