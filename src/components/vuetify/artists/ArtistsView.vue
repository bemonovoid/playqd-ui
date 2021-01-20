<template>

  <div>

    <v-row>
      <v-col align="left">
        <v-btn depressed plain class="text-capitalize" to="/library">
          <v-icon left>mdi-arrow-left</v-icon>
          <span>Library</span>
        </v-btn>
      </v-col>
    </v-row>

    <v-row>

      <v-col>

        <v-list align="left">

          <v-subheader class="pl-0">
            <h1>Artists</h1>
          </v-subheader>

          <v-text-field placeholder="Find in artists"
                        v-model="searchFilter"
                        @input="filterArtists()"
                        prepend-inner-icon="mdi-magnify">
            <v-icon slot="append" @click="clearInput()">mdi-close</v-icon>
          </v-text-field>

          <v-list-item-group color="primary">

            <v-list-item v-for="(artist, i) in artists" :key="i" @click="onArtistSelected(artist.id)">

              <v-list-item-content>
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
      artists: []
    }
  },
  methods: {
    onArtistSelected(artistId) {
      this.$router.push({name: 'AlbumsView', params: {artistId: artistId}});
    },
    filterArtists() {
      if (this.searchFilter === '') {
        this.artists = this.$store.getters.getArtists;
      } else {
        let filter = this.searchFilter.toLowerCase();
        this.artists = this.$store.getters.getArtists.filter(artist => artist.name.toLowerCase().includes(filter));
      }
    },
    clearInput() {
      this.searchFilter = '';
      this.filterArtists();
    }
  },
  created() {
    if (this.$store.getters.getArtists.length === 0) {
      HTTP_CLIENT.get('/library/artists/').then(response => {
        this.$store.commit('setArtists', response.data.artists);
        this.artists = this.$store.getters.getArtists;
      }).catch(error => {
        alert(error.toString())
      });
    } else {
      this.artists = this.$store.getters.getArtists;
    }
  }
}
</script>