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

import Audio from "@/components/library/Audio";
import NavToolbarView from "@/components/vuetify/library/NavToolbarView";
import MiniPlayerView from "@/components/vuetify/miniplayer/MiniPlayerView";
import LibraryView from "@/components/vuetify/library/LibraryView";
import GenresView from "@/components/vuetify/genres/GenresView";
import ArtistsView from "@/components/vuetify/artists/ArtistsView";
import AlbumsView from "@/components/vuetify/albums/AlbumsView"
import SongsView from "@/components/vuetify/songs/SongsView";

import {PAGE_TITLE_UTILS} from "@/utils/page-title-utils";

const routes = [
  { path: '/', alias: ['/home', '/index.html'], name: 'Home', component: LibraryView, meta: {title: 'Home'} },
  { path: '/library', name: 'LibraryView', component: LibraryView, meta: {title: 'Library'} },
  { path: '/library/artists', name: 'ArtistsView', component: ArtistsView, meta: {title: 'Artists'} },
  { path: '/library/genres', name: 'GenresView', component: GenresView, meta: {title: 'Genres'} },
  { path: '/library/albums', name: 'AlbumsView', component: AlbumsView, props: route => ({artistId: route.query.artistId, genre: route.query.genre}), meta: {title: 'Albums'} },
  { path: '/library/artists/albums/:albumId', name: 'SongsView', component: SongsView, meta: {title: 'Songs'} }
]

const router = new VueRouter({
  routes
});

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    PAGE_TITLE_UTILS.setPageTitle(to.meta.title);
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
    LibraryView,
    GenresView,
    ArtistsView,
    AlbumsView,
    SongsView
  }
}

</script>
