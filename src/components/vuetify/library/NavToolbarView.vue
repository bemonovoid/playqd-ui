<template>
  <v-app-bar dense color="blue lighten-2" fixed flat elevation="0">
    <v-toolbar-title v-if="this.$route.name !== 'LibraryView'">
      <v-btn depressed plain class="text-capitalize text-subtitle-1"
             v-bind:to="toolBarParams.routeParams">
        <v-icon left>mdi-arrow-left</v-icon>
        <span>{{this.toolBarParams.title}}</span>
      </v-btn>
    </v-toolbar-title>

    <v-spacer/>

    <v-menu offset-y v-if="this.$route.name === 'AlbumsView'">
      <template v-slot:activator="{ attrs, on}">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list dense align="left">
        <v-subheader>Sort albums</v-subheader>
        <v-list-item v-for="sortItem in albumSortData" @click="sortAlbums(sortItem.id)">
          <v-list-item-title>{{sortItem.name}}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-bottom-sheet inset persistent v-model="bottomSheet.enable" v-if="this.$route.name === 'SongsView'">

      <template v-slot:activator="{attrs, on}">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-sheet class="text-center">

        <v-card elevation="1">

          <v-toolbar light elevation="0">

            <div class="py-2 pr-3">
              <v-img max-height="50px" max-width="50px" v-bind:src="this.bottomSheet.album.artworkSrc"></v-img>
            </div>

            <v-toolbar-title>
              <div class="caption px-2 text-left text-truncate">
                {{this.bottomSheet.album.artistName}}
              </div>
              <div class="caption px-2 text-left text-truncate">
                <small>{{ this.bottomSheet.album.name}}</small>
              </div>
            </v-toolbar-title>

            <v-spacer></v-spacer>
            <v-btn icon @click="bottomSheet.enable = !bottomSheet.enable">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-divider/>

          <v-list subheader>

            <v-list-item align="left" @click="resolveArtworkOnline()" v-if="this.bottomSheet.album.artworkUnknown">

              <v-list-item-content>
                  <v-list-item-title>Resolve artwork online</v-list-item-title>
                  <v-list-item-subtitle class="text-wrap">Set the content filtering level to restrict appts that can be downloaded</v-list-item-subtitle>
                </v-list-item-content>

              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="grey lighten-1">mdi-information</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>Play next</v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>Play prev</v-list-item-content>
            </v-list-item>
          </v-list>


        </v-card>

      </v-sheet>
    </v-bottom-sheet>

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
      albumSortData: [
        {id: 'by-title', name: 'Title'},
        {id: 'by-newest', name: 'Newest First'},
        {id: 'by-oldest', name: 'Oldest First'}
      ],
      bottomSheet: {
        enable: false,
        album: {
          id: -1,
          name: '',
          artistName: '',
          artworkUnknown: true,
          artworkSrc: ''
        }
      },
      toolBarParams: {
        title: '',
        routeParams: {}
      }
    }
  },
  created() {
    eventBus.$on('toolbar-back-route-changed', (options) => {
      this.toolBarParams = options.toolBarParams;
      if (options.album) {
        this.bottomSheet.album = {
          id: options.album.id,
          name: options.album.name,
          artistName: options.album.artist.name,
          artworkUnknown: options.album.artworkStatus === 'UNKNOWN',
          artworkSrc: this.$store.getters.getArtWorkBaseUrl + '?albumId=' + options.album.id
        }
      }
    });
  },
  methods: {
    sortAlbums(sortBy) {
      eventBus.$emit('sort-albums', sortBy);
    },
    resolveArtworkOnline() {
      if (this.bottomSheet.album.artworkUnknown) {
        HTTP_CLIENT.get('/artwork/search/?albumId=' + this.bottomSheet.album.id).then(response => {
          this.bottomSheet.album.artworkSrc = response.data.url;
        }).catch((error) => {
          alert('Failed to resolve artwork')
        });
      }
    }
  }
}

</script>