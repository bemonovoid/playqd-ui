<template>

  <div>

    <v-row>

      <v-col class="pl-0 text-left" md="auto">
        <v-btn depressed plain class="text-capitalize text-subtitle-1" v-bind:to="backToView">
          <v-icon left>mdi-arrow-left</v-icon>
          <span>{{this.listTitle}}</span>
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
            <v-subheader>Sort albums</v-subheader>
            <v-list-item v-for="sortType in sorting.types" @click="applyNewSort(sortType)">
              <v-list-item-title>{{sortType.name}}</v-list-item-title>
              <v-list-item-icon v-if="sortType.active">
                <v-icon right>mdi-check</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="py-0">
        <v-item-group align="left">
          <v-text-field placeholder="Find album"
                        v-model="searchFilter"
                        @input="filterAlbums()"
                        prepend-inner-icon="mdi-magnify"
                        @click:clear="clearInput()"
                        clearable>
          </v-text-field>
        </v-item-group>

      </v-col>
    </v-row>

    <v-row class="justify-space-around pb-15">
      <v-col v-for="album in albums" :key="album.id" :cols="6" align="center" md="auto">
        <v-card max-width="200px" max-height="300px" :to="{name: 'SongsView', params: {albumId: album.id}}">

          <v-img :src="$store.getters.getArtWorkBaseUrl + album.id"
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

          <v-card-subtitle class="py-0 text-left text-truncate text-caption text--disabled" v-text="album.date ? album.date : '----'"></v-card-subtitle>

        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="text-center" v-if="paginationRequired()">
          <v-pagination class="pb-15" v-model="pagination.page"
                        @input="showPage"
                        :total-visible="pagination.totalVisible"
                        :length="pagination.length"></v-pagination>
        </div>
      </v-col>
    </v-row>

  </div>

</template>


<script>

import {HTTP_CLIENT} from "@/http/axios-config"
import {eventBus} from "@/main";

const ITEMS_PER_PAGE = 12;

export default {
  name: 'AlbumsView',
  components: {},
  data() {
    return {
      sorting: {
        types: [
          {id: 'by-title', name: 'Title', active: false},
          {id: 'by-newest', name: 'Newest First', active: true},
          {id: 'by-oldest', name: 'Oldest First', active: false}
        ]
      },
      pagination: {
        page: 1,
        totalVisible: 7,
        length: 15
      },
      searchFilter: '',
      originalAlbums: [],
      albums: [],
      listTitle: '',
      backToView: {name: '', params: {}}
    }
  },
  methods: {
    paginationRequired() {
      return this.originalAlbums.length > ITEMS_PER_PAGE;
    },
    showNextPage() {
      this.showPage(this.pagination.page);
    },
    showPrevPage() {
      this.showPage(this.pagination.page);
    },
    showPage(pageId) {
      let startIdx = 0;
      let endIdx = ITEMS_PER_PAGE;
      if (pageId > 1) {
        startIdx = (pageId - 1) * ITEMS_PER_PAGE;
        endIdx = startIdx +  ITEMS_PER_PAGE;
      }
      this.albums = Array.from(this.originalAlbums.slice(startIdx, endIdx));
    },
    clearInput() {
      this.searchFilter = '';
      this.filterAlbums();
    },
    filterAlbums() {
      if (!this.searchFilter || this.searchFilter === '') {
        this.albums = this.originalAlbums;
      } else {
        let filter = this.searchFilter.toLowerCase();
        this.albums = this.originalAlbums.filter(album => album.name.toLowerCase().includes(filter));
      }
    },
    applyNewSort(sortConfig) {
      this.sorting.types.forEach(item => item.active = false);
      sortConfig.active = true;
      this.sortAlbums(this.originalAlbums);
      this.albums = this.originalAlbums.slice(0, ITEMS_PER_PAGE);
      this.pagination.page = 1;
    },
    sortAlbums(albums) {
      let sortTypeId = this.sorting.types.filter(item => item.active)[0].id;
      if ('by-oldest' === sortTypeId) {
        albums.sort((a1, a2) => {
          if (a1.date && a2.date) {
            if (a1.date > a2.date) return 1;
            if (a1.date < a2.date) return -1;
            return 0;
          }
          return 0;
        })
      } else if ('by-newest' === sortTypeId) {
        albums.sort((a1, a2) => {
          if (a1.date && a2.date) {
            if (a1.date < a2.date) return 1;
            if (a1.date > a2.date) return -1;
            return 0;
          }
          return 0;
        })
      } else if ('by-title' === sortTypeId) {
        albums.sort((a1, a2) => {
          let a1Name = a1.name;
          let a2Name = a2.name;
          return a1Name.localeCompare(a2Name);
        });
      } else {

      }
    }
  },
  created() {
    let query = '';
    if (this.$route.query.artistId) {
      this.backToView = {name: 'ArtistsView'}
      query = '?artistId=' + this.$route.query.artistId;
    } else {
      query = '?genre=' + this.$route.query.genre;
      this.backToView = {name: 'GenresView'}
      this.sorting.type = 'by-title';
    }

    HTTP_CLIENT.get('/library/albums/' + query).then(response => {
      this.originalAlbums = Array.from(response.data.albums);
      this.sortAlbums(this.originalAlbums);
      this.albums = this.originalAlbums.slice(0, ITEMS_PER_PAGE);
      this.listTitle = this.$route.query.artistId ? 'Artists' : 'Genres';
      this.pagination.length = Math.ceil(this.originalAlbums.length / ITEMS_PER_PAGE);
    });
  }
}
</script>