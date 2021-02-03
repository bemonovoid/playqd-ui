<template>

  <div>
    <v-row>

      <v-col class="pl-0 text-left" md="auto">
        <v-btn depressed plain class="text-capitalize text-subtitle-1" v-bind:to="{name: 'LibraryView'}">
          <v-icon left>mdi-arrow-left</v-icon>
          <span>Library</span>
        </v-btn>
      </v-col>

      <v-col class="text-right">
        <v-menu offset-y left>
          <template v-slot:activator="{ attrs, on}">
            <v-btn fab small icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <v-list dense class="text-left">
            <v-subheader>Sort artists</v-subheader>
            <v-list-item v-for="sortType in sorting.types" @click="sortArtists(sortType.id)">
              <v-list-item-title>{{sortType.name}}</v-list-item-title>
              <v-list-item-icon>
                <v-icon right>{{sortType.icon}}</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>

    </v-row>
    <v-row>
      <v-col class="py-0">

        <v-list align="left" class="py-0">

          <p class="text-left text--black display-1 pt-1 pb-0 mb-0">Artists</p>

          <v-item-group align="left" class="py-0">
            <v-text-field placeholder="Find in artists"
                          v-model="searchFilter"
                          @input="filterArtists()"
                          clearable
                          @click:clear="clearInput()"
                          prepend-inner-icon="mdi-magnify">
            </v-text-field>
          </v-item-group>

          <v-list-item-group color="primary">

            <v-list-item v-for="(artist, i) in artists" :key="i" @click="onArtistSelected(artist.id)">

              <v-list-item-icon class="ml-0 mr-2">
                <v-icon left>mdi-account-music</v-icon>
              </v-list-item-icon>

              <v-list-item-content class="py-0">

                <!--                <v-text-field dense class="pb-0 mb-0"-->
<!--                    readonly outlined prepend-icon="mdi-account-music" :value="artist.name"></v-text-field>-->
                <v-list-item-title v-text="artist.name"></v-list-item-title>
              </v-list-item-content>

            </v-list-item>

          </v-list-item-group>

        </v-list>

      </v-col>

    </v-row>
  </div>


</template>

<script>

import {eventBus} from "@/main";
import {HTTP_CLIENT} from "@/http/axios-config"

import {mdiArrowLeft, mdiMagnify, mdiClose} from '@mdi/js'

export default {
  name: 'ArtistsView',
  components: {
    mdiArrowLeft, mdiMagnify, mdiClose
  },
  data() {
    return {
      searchFilter: '',
      artists: [],
      sorting: {
        types: [
          {id: 'name', name: 'By Name', icon: 'mdi-sort-alphabetical-ascending'},
          {id: 'play-last-date', name: 'Recently Played', icon: 'mdi-sort-clock-ascending-outline'},
          {id: 'play-count', name: 'Most Played', icon: 'mdi-sort-descending'}
        ]
      }
    }
  },
  methods: {
    onArtistSelected(artistId) {
      this.$router.push({name: 'AlbumsView', query: {artistId: artistId}});
    },
    filterArtists() {
      if (!this.searchFilter || this.searchFilter === '') {
        this.artists = this.$store.getters.getArtists;
      } else {
        let filter = this.searchFilter.toLowerCase();
        this.artists = this.$store.getters.getArtists.filter(artist => artist.name.toLowerCase().includes(filter));
      }
    },
    clearInput() {
      this.searchFilter = '';
      this.filterArtists();
    },
    sortArtists(sortType) {
      if (sortType === 'name') {
        this.artists.sort((a1, a2) => {
          let a1Name = a1.name;
          let a2Name = a2.name;
          return a1Name.localeCompare(a2Name);
        });
      }
      if (sortType === 'play-last-date') {
        this.artists.sort((a1, a2) => {
          if (a1.playbackHistory.lastTimePlayed < a2.playbackHistory.lastTimePlayed) return 1;
          if (a1.playbackHistory.lastTimePlayed > a2.playbackHistory.lastTimePlayed) return -1;
          return 0;
          return 0;
        })
      }
      if (sortType === 'play-count') {
        this.artists.sort((a1, a2) => {
          return a2.playbackHistory.playCount - a1.playbackHistory.playCount;
        })
      }
    }
  },
  created() {
    eventBus.$emit('toolbar-back-route-changed', {
      toolBarParams: {title: 'Library', routeParams: {name: 'LibraryView'}}
    });
    if (this.$store.getters.getArtists.length === 0) {
      HTTP_CLIENT.get('/library/artists/').then(response => {
        this.$store.commit('setArtists', response.data.artists);
        this.artists = this.$store.getters.getArtists;
        this.sortArtists('play-last-date');
      }).catch(error => {
        alert(error.toString())
      });
    } else {
      this.artists = this.$store.getters.getArtists;
    }
  }
}
</script>