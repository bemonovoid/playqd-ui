<template>
  <v-app class="grey lighten-4">
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
    <MiniPlayerView/>
  </v-app>
</template>

<script>

import store from "@/store/vuex-store";
import Vue from 'vue'
import VueRouter from "vue-router";

import Audio from "@/components/library/Audio";
import MiniPlayerView from "@/components/vuetify/miniplayer/MiniPlayerView";
import LibraryView from "@/components/vuetify/library/LibraryView";
import ArtistsView from "@/components/vuetify/artists/ArtistsView";
import AlbumsView from "@/components/vuetify/albums/AlbumsView"
import SongsView from "@/components/vuetify/songs/SongsView";

import {PAGE_TITLE_UTILS} from "@/utils/page-title-utils";

const routes = [
  { path: '/', alias: ['/home', '/index.html'], name: 'Home', component: LibraryView, meta: {title: 'Home'} },
  { path: '/library', name: 'LibraryView', component: LibraryView, meta: {title: 'LibraryView'} },
  { path: '/library/artists', name: 'ArtistsView', component: ArtistsView, meta: {title: 'ArtistsView'} },
  { path: '/library/artists/:artistId', name: 'AlbumsView', component: AlbumsView, meta: {title: 'AlbumsView'} },
  { path: '/library/artists/albums/:albumId', name: 'SongsView', component: SongsView, meta: {title: 'SongsView'} }
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
    MiniPlayerView,
    LibraryView,
    ArtistsView,
    AlbumsView,
    SongsView
  }
}

</script>
