<template>
  <div id=app>
<!--    <img alt="Vue logo" src="./assets/logo.png" />-->
    <b-container fluid="sm">
      <Audio/>
      <b-row>
        <b-col>
          <router-view></router-view>
        </b-col>
      </b-row>
      <MiniPlayer/>
    </b-container>
  </div>
</template>

<script>

import store from "@/store/vuex-store";
import Vue from 'vue'
import VueRouter from "vue-router";

import Audio from "@/components/library/Audio";
import Library from './components/library/Library'
import Artists from './components/library/Artists'
import Albums from './components/library/Albums'
import Songs from './components/library/Songs'
import Player from './components/library/Player'
import MiniPlayer from './components/library/MiniPlayer'

import {PAGE_TITLE_UTILS} from "@/utils/page-title-utils";

const routes = [
  { path: '/', alias: ['/home', '/index.html'], name: 'Home', component: Library, meta: {title: 'Home'} },
  { path: '/library', name: 'Library', component: Library, meta: {title: 'Library'} },
  { path: '/library/artists', name: 'Artists', component: Artists, meta: {title: 'Artists'} },
  { path: '/library/artists/:artistId', name: 'Albums', component: Albums, meta: {title: 'Albums'} },
  { path: '/library/artists/albums/:albumId', name: 'Songs', component: Songs, meta: {title: 'Songs'} },
  { path: '/library/player/:songId', name: 'Player', component: Player, meta: {title: 'Player'} }
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
    Audio
    Library,
    Artists,
    Albums,
    Songs,
    Player,
    MiniPlayer
  }
}

</script>
