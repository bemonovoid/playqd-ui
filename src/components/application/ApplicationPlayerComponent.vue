<template>

  <div>
    <v-row>
      <v-col align-self="start" class="text-left fill-height" md="auto">
        <v-navigation-drawer hide-overlay width="200">

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-h5">
                Playqd
              </v-list-item-title>
              <v-list-item-subtitle>
                Music player
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list dense nav>
            <v-list-item-group v-model="selectedNavDrawerItemIdx">
              <v-list-item v-for="item in navDrawerItems" :key="item.id" @click="showNavDrawerItem(item)">
                <v-list-item-icon class="mx-2">
                  <v-icon small v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content class="ml-1">
                  <v-list-item-title>{{item.title}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>

        </v-navigation-drawer>
      </v-col>

      <v-col class="text-left">
        <v-row>
          <v-col cols="3" class="text-left" align-self="center">
            <NavToolbarComponent></NavToolbarComponent>
          </v-col>
        </v-row>
        <router-view></router-view>
      </v-col>

    </v-row>
    <PlayerComponent :playlist-utils="playlistUtils"></PlayerComponent>
  </div>

</template>

<script>

import playlistUtils from "@/utils/playlistUtils";
import NavToolbarComponent from "@/components/application/NavToolbarComponent";
import PlayerComponent from "@/components/application/PlayerComponent";

export default {
  name: "ApplicationPlayerComponent",
  components: {NavToolbarComponent, PlayerComponent},
  data() {
    return {
      playlistUtils: playlistUtils,
      selectedNavDrawerItemIdx: 0,
      navDrawerItems: [
        { id: "ArtistsComponent",   icon: "mdi-account-music", title: "Artists"},
        { id: "AlbumsComponent",    icon: "mdi-playlist-music-outline", title: "Albums"},
        { id: "SongsComponent",     icon: "mdi-music-note", title: "Songs"},
        { id: "GenresComponent",    icon: "mdi-guitar-electric", title: "Genres"},
        { id: "PlaylistsComponent", icon: "mdi-account-music", title: "Playlist"},
        { id: "SettingsComponent",  icon: "mdi-account-music",  title: "Settings"}
      ]
    }
  },
  methods: {
    showNavDrawerItem(navItem) {
      this.$router.push({name: navItem.id});
    }
  }
}
</script>