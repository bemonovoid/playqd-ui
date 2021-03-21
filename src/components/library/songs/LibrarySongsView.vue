<template>

  <div v-if="this.songs">

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
                <v-list-item-group color="primary" v-model="selectedSortType.idx">
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
        </v-list-item>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="py-0">

        <v-list class="text-left" dense>

          <v-item-group align="left" class="py-0">
            <v-text-field flat dense clearable placeholder="Find in songs"
                          @keydown.enter="findSongsByName()" @keydown.esc="clearInput()"
                          v-model="songsNameQuery"
                          @click:clear="clearInput()"
                          prepend-inner-icon="mdi-text-short"
                          append-outer-icon="mdi-magnify"
                          @click:append-outer="findSongsByName()">
            </v-text-field>
          </v-item-group>

          <v-list-item-group color="primary">

            <template v-for="(song, i) in songs">
              <v-list-item :key="i" @click="playLibrarySongs(i)" three-line class="px-0">

                <v-list-item-avatar v-if="albumsWithImageNotFound.includes(song.album.id)" class="ml-0 mr-2">
                  <v-img src="@/assets/default-album-cover.png" ></v-img>
                </v-list-item-avatar>

                <v-list-item-avatar v-else class="ml-0 mr-2">
                  <v-img :src="$store.getters.getResourceBaseUrl + 'image/' + song.album.id + '?target=ALBUM'" alt="alt" @error="imageError(song.album.id)"></v-img>
                </v-list-item-avatar>

                <v-list-item-content class="py-0">
                  <v-list-item-title class="text-body-2">{{song.name}}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{song.artist.name}}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="text-caption">
                    <i>{{song.fileExtension}}, play count: {{song.playCount}}, last: {{song.lastPlayedTime}}</i>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-list-item-action-text>
                    <div class="text--secondary">
                      {{SONG_DURATION.convertSecondsToMinutesAndSeconds(song.duration)}}
                    </div>
                  </v-list-item-action-text>
                  <v-icon v-if="song.favorite === true" color="yellow darken-3">mdi-star</v-icon>
                </v-list-item-action>

              </v-list-item>

              <v-divider></v-divider>
            </template>

          </v-list-item-group>

        </v-list>

      </v-col>

    </v-row>

    <v-row>
      <v-col>
        <v-pagination circle
                      v-model="pagination.page"
                      @next="nextPage"
                      @previous="prevPage"
                      @input="selectPage"
                      :total-visible="5"
                      :length="pagination.totalPages" ></v-pagination>
      </v-col>
    </v-row>

  </div>
</template>

<script>

import api from "@/http/playqdAPI";
import {SONG_HELPER} from "@/utils/songs-helper";
import {eventBus} from "@/main";

export default {
  name: "LibrarySongsView",
  data() {
    return {
      SONG_DURATION: SONG_HELPER,
      sorting: {
        types: [
          {id: 'NAME',            idx: 0, name: 'Name',            direction: 'ASC',  icon: 'mdi-sort-alphabetical-ascending'},
          {id: 'FAVORITES',       idx: 1, name: 'Favorites',       direction: 'ASC',  icon: 'mdi-star-outline'},
          {id: 'RECENTLY_ADDED',  idx: 2, name: 'Recently Added',  direction: 'ASC',  icon: 'mdi-sort-clock-ascending-outline'},
          {id: 'RECENTLY_PLAYED', idx: 3, name: 'Recently Played', direction: 'DESC', icon: 'mdi-sort-clock-ascending-outline'},
          {id: 'MOST_PLAYED',     idx: 4, name: 'Most played',     direction: 'DESC', icon: 'mdi-sort-ascending'}
        ]
      },
      albumsWithImageNotFound: [],
      selectedSortItemIdx: null,
      songsNameQuery: null,
      songs: null,
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
    },
    playLibrarySongs(songIdx) {
      eventBus.$emit('play-playlist', {songs: this.songs, startSongIdx: songIdx, shuffle: false});
    },
    imageError(albumId) {
      this.albumsWithImageNotFound.push(albumId);
    }
  }
}
</script>

<style scoped>

</style>