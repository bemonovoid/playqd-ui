<template>

  <div>
    <v-row>
      <v-col class="py-0">

        <v-item-group align="left">
          <label for="searchArtistsInput" class="text-h6">Artists</label>
          <v-text-field id="searchArtistsInput" placeholder="Find in artists"
                        v-model="searchFilter"
                        @input="filterArtists()"
                        prepend-inner-icon="mdi-magnify">
            <v-icon slot="append" @click="clearInput()">mdi-close</v-icon>
          </v-text-field>
        </v-item-group>

        <v-list align="left" class="py-0">

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
    eventBus.$emit('toolbar-back-route-changed', {
      toolBarParams: {title: 'Library', routeParams: {name: 'LibraryView'}}
    });
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