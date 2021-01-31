<template>

  <v-bottom-sheet inset persistent v-model="songMenuOptions.enable">

    <template v-slot:activator="{attrs, on}">
      <v-btn icon fab small v-bind="attrs" v-on="on">
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
    </template>

    <v-sheet class="text-center">

      <v-card elevation="1">

        <v-toolbar color="grey lighten-3" elevation="0">

          <div class="py-2 pr-3">
            <v-img max-height="50px" max-width="50px" v-bind:src="this.$store.state.artwork.ofOpenedAlbum"></v-img>
          </div>

          <v-toolbar-title>
            <div class="caption px-2 text-left text-truncate">
              {{this.album.artist.name}}
            </div>
            <div class="caption px-2 text-left text-truncate">
              <small>{{ this.album.name}}</small>
            </div>
          </v-toolbar-title>

          <v-spacer></v-spacer>
          <v-btn icon @click="songMenuOptions.enable = !songMenuOptions.enable">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider/>

        <v-list dense subheader>

          <v-list-item class="text-left" @click="resolveArtworkOnline()" :disabled="artworkNotFound">

            <v-list-item-content>
              <v-list-item-title>Resolve artwork online</v-list-item-title>
              <v-list-item-subtitle v-if="artworkNotFound">
                <span class="red--text">Not available</span>
              </v-list-item-subtitle>
              <v-list-item-subtitle v-else class="text-wrap">
                Search for album artist online and try to resolve the artwork
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action v-if="this.artworkSearchInProgress">
              <v-progress-circular size="20" indeterminate color="grey"></v-progress-circular>
            </v-list-item-action>

            <v-list-item-action v-else>
              <v-btn icon>
                <v-icon :color="artworkNotFound ? 'red' : 'grey lighten-1'">mdi-image-search-outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider/>

          <v-list-item>
            <v-list-item-content>
              Show song title as file name
            </v-list-item-content>
            <v-list-item-action>
              <v-switch color="info" hide-details
                        v-model="songNameViewSwitch"
                        @change="$emit('update:showSongNameAsFileName', songNameViewSwitch);">
              </v-switch>
            </v-list-item-action>
          </v-list-item>

          <v-divider/>

          <v-list-item>
            <v-list-item-content>Play prev</v-list-item-content>
          </v-list-item>

        </v-list>

      </v-card>

    </v-sheet>
  </v-bottom-sheet>
</template>

<script>

import {HTTP_CLIENT} from "@/http/axios-config";

export default {
  name: 'SongDropdownOptionsView',
  props: ['album', 'showSongNameAsFileName'],
  data() {
    return {
      songMenuOptions: {
        enable: false
      },
      songNameViewSwitch: this.showSongNameAsFileName,
      artworkSearchInProgress: false,
      artworkNotFound: false
    }
  },
  methods: {
    resolveArtworkOnline() {
      if (!this.artworkNotFound) {
        this.artworkSearchInProgress = true;
        HTTP_CLIENT.get('/artwork/search/?albumId=' + this.album.id).then(response => {
          this.artworkSearchInProgress = false;
          this.$store.commit('setArtworkOfOpenedAlbum', {albumId: this.album.id, src: response.data.url});
        }).catch((error) => {
          this.artworkSearchInProgress = false;
          this.artworkNotFound = true;
        });
      }
    }
  }
}


</script>