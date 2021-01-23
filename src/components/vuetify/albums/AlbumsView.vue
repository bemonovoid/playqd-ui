<template>

  <div>

    <v-row>
      <v-col class="py-0">
        <v-item-group align="left">
          <label for="searchAlbumsInput" class="text-h6">{{this.artistName}}</label>
          <v-text-field id="searchAlbumsInput" placeholder="Find album"
                        v-model="searchFilter"
                        @input="filterAlbums()"
                        prepend-inner-icon="mdi-magnify">
            <v-icon slot="append" @click="clearInput()">mdi-close</v-icon>
          </v-text-field>
        </v-item-group>

      </v-col>
    </v-row>

    <v-row class="justify-space-around">
      <v-col v-for="album in albums" :key="album.id" :cols="6" align="center" md="auto">
        <v-card max-width="200px" max-height="300px" :to="{name: 'SongsView', params: {albumId: album.id}}">

          <v-img :src="$store.getters.getArtWorkBaseUrl + '?albumId=' + album.id"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)">
          </v-img>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-card-subtitle
                  class="py-0 text-left text-truncate text-subtitle-2"
                  v-bind="attrs" v-on="on"
                  v-text="album.name">
              </v-card-subtitle>
            </template>
            <span>{{ album.name }}</span>
          </v-tooltip>

          <v-card-subtitle class="py-0 text-left text-truncate text-caption text--disabled" v-text="album.year"></v-card-subtitle>

        </v-card>
      </v-col>
    </v-row>

  </div>

</template>


<script>

import {HTTP_CLIENT} from "@/http/axios-config"
import {eventBus} from "@/main";

export default {
  name: 'AlbumsView',
  components: {},
  data() {
    return {
      searchFilter: '',
      originalAlbums: [],
      albums: [],
      artistName: ''
    }
  },
  methods: {
    clearInput() {
      this.searchFilter = '';
      this.filterAlbums();
    },
    filterAlbums() {
      if (this.searchFilter === '') {
        this.albums = this.originalAlbums;
      } else {
        let filter = this.searchFilter.toLowerCase();
        this.albums = this.originalAlbums.filter(album => album.name.toLowerCase().includes(filter));
      }
    },
    sortAlbums(sortBy) {
      if ('by-oldest' === sortBy) {
        this.albums.sort((a1, a2) => {
          if (a1.year && a2.year) {
            if (a1.year > a2.year) return 1;
            if (a1.year < a2.year) return -1;
            return 0;
          }
          return 0;
        })
      } else if ('by-newest' === sortBy) {
        this.albums.sort((a1, a2) => {
          if (a1.year && a2.year) {
            if (a1.year < a2.year) return 1;
            if (a1.year > a2.year) return -1;
            return 0;
          }
          return 0;
        })
      } else if ('by-title' === sortBy) {
        this.albums.sort((a1, a2) => {
          let a1Name = a1.name;
          let a2Name = a2.name;
          return a1Name.localeCompare(a2Name);
        });
      } else {

      }
    }
  },
  created() {
    let artistId = this.$route.params.artistId;
    eventBus.$emit('toolbar-back-route-changed', {
      toolBarParams: {title: 'Artists', routeParams: {name: 'ArtistsView'}}
    });
    HTTP_CLIENT.get('/library/artists/' + artistId + '/albums').then(response => {
      this.originalAlbums = Array.from(response.data.albums);
      this.albums = response.data.albums;
      this.sortAlbums('by-newest')
      this.artistName = response.data.artist.name
    });
    eventBus.$on('sort-albums', (sortBy) => {
      this.sortAlbums(sortBy);
    });
  }
}
</script>