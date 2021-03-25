<template>

  <div>

    <v-row>
      <v-col class="py-0 px-0 text-left">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="display-1">Songs</v-list-item-title>
            <v-list-item-subtitle class="text-caption text--disabled">
              Total: {{pagination.totalElements}}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-menu offset-y left>
              <template v-slot:activator="{ attrs, on}">
                <v-btn small icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>

              <v-list dense class="text-left">
                <v-subheader>Sort songs</v-subheader>
                <v-list-item-group  color="primary" v-model="selectedSortType.idx">
                  <v-list-item v-for="(sortType, i) in sorting.types" :key="i" @click="sortSongs(sortType)">
                    <v-list-item-title>{{sortType.name}}</v-list-item-title>
                    <v-list-item-icon>
                      <v-icon right>{{sortType.icon}}</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </v-list-item-action>
          <v-list-item-action>
            <v-menu offset-y left>
              <template v-slot:activator="{ attrs, on}">
                <v-btn small icon v-bind="attrs" v-on="on">
                  <v-icon small>mdi-filter-menu-outline</v-icon>
                </v-btn>
              </template>

              <v-list dense class="text-left">
                <v-subheader>Filter songs</v-subheader>
                <v-list-item-group color="primary" v-model="selectedSortType.idx">
                  <v-list-item v-for="(filter, i) in filters.general" :key="i" @click="sortSongs(filter)">
                    <v-list-item-title>{{filter.name}}</v-list-item-title>
                    <v-list-item-icon>
                      <v-icon right>{{filter.icon}}</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="py-0 px-0 text-left">
        <v-list-item>
          <v-list-item-content class="py-0">
            <v-text-field flat dense clearable placeholder="Find in songs"
                          @keydown.enter="findSongsByName()" @keydown.esc="clearInput()"
                          v-model="songsNameQuery"
                          @click:clear="clearInput()"
                          prepend-inner-icon="mdi-text-short"
                          append-outer-icon="mdi-magnify"
                          @click:append-outer="findSongsByName()">
            </v-text-field>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="py-0">

        <SongsListView :songs-data.sync="this.songs" :library-list="true"></SongsListView>

      </v-col>

    </v-row>

    <v-row>
      <v-col>
        <v-pagination v-model="pagination.page"
                      @next="nextPage"
                      @previous="prevPage"
                      @input="selectPage"
                      :total-visible="5"
                      :length="pagination.totalPages">
        </v-pagination>
      </v-col>
    </v-row>

  </div>
</template>

<script>

import api from "@/http/playqdAPI";
import SongsListView from "@/components/library/songs/SongsListView";

export default {
  name: "LibrarySongsView",
  components: {SongsListView},
  data() {
    return {
      filters: {
        general: [
          {id: 'FAVORITES',       idx: 1, name: 'Favorites',       direction: 'ASC',  icon: 'mdi-star-outline'},
          {id: 'RECENTLY_ADDED',  idx: 2, name: 'Recently Added',  direction: 'ASC',  icon: 'mdi-sort-clock-ascending-outline'},
          {id: 'RECENTLY_PLAYED', idx: 3, name: 'Recently Played', direction: 'DESC', icon: 'mdi-sort-clock-ascending-outline'}
        ],
        format: ['flac', 'm4a', 'mp3', 'ogg', 'wav', 'wma'],
        formatSelected: null
      },
      sorting: {
        types: [
          {id: 'NAME',            idx: 0, name: 'Name',            direction: 'ASC',  icon: 'mdi-sort-alphabetical-ascending'},
          {id: 'MOST_PLAYED',     idx: 4, name: 'Most played',     direction: 'DESC', icon: 'mdi-sort-ascending'}
        ]
      },
      songsNameQuery: null,
      songs: [],
      pagination: {
        page: 1,
        pageSize: 6,
        totalElements: 0,
        totalPages: 0
      },
      selectedSortType: {},
      defaultPageRequest: {},
    }
  },
  mounted() {
    this.selectedSortType = this.sorting.types[0];
    this.defaultPageRequest = { page: 0, sort: this.sorting.types[0] };
    this.findSongs(this.createPageRequest(this.defaultPageRequest.page, this.defaultPageRequest.sort));
  },
  methods: {
    findSongs(pageRequest) {
      api.getSongs(pageRequest).then(response => {
        this.songs = response.data.songs;
        this.pagination = { page: response.data.page + 1, pageSize: response.data.pageSize, totalElements: response.data.totalElements, totalPages: response.data.totalPages };
      });
    },
    findSongsByName() {
      if (this.songsNameQuery && this.songsNameQuery.length > 0) {
        this.selectedSortType = this.sorting.types[0];
        this.findSongs(this.createPageRequest(1));
      }
    },
    clearInput() {
      this.songsNameQuery = null;
      this.findSongs(this.createPageRequest(this.defaultPageRequest.page, this.defaultPageRequest.sort));
    },
    sortSongs(sortType) {
      this.selectedSortType = sortType;
      this.findSongs(this.createPageRequest(1));
    },
    nextPage() {
      this.findSongs(this.createPageRequest(this.pagination.page));
    },
    prevPage() {
      this.findSongs(this.createPageRequest(this.pagination.page));
    },
    selectPage(page) {
      this.findSongs(this.createPageRequest(page));
    },
    createPageRequest(page, sortType) {
      return { page: page, pageSize: 6, sort: sortType ? sortType : this.selectedSortType, name: this.songsNameQuery }
    }
  }
}
</script>

<style scoped>

</style>