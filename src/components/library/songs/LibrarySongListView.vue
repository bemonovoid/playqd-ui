<template>

  <div v-if="this.songs">

    <v-row>
      <v-col class="py-0 pl-0 text-left">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="display-1">Songs</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-menu offset-y left>
              <template v-slot:activator="{ attrs, on}">
                <v-btn small icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>

              <v-list dense class="text-left">
                <v-subheader>Filter songs</v-subheader>
                <v-list-item v-for="(sortType, i) in sorting.types" :key="i" @click="getSongsFiltered(10, sortType.id)">
                  <v-list-item-title>{{sortType.name}}</v-list-item-title>
                  <v-list-item-icon>
                    <v-icon right>{{sortType.icon}}</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="py-0">

        <v-list class="text-left" dense>

          <v-list-item-group color="primary">

            <template v-for="(song, i) in songs">
              <v-list-item :key="i" @click="playLibrarySongs(i)" three-line class="pl-0">

                <v-list-item-avatar tile class="text-left">
                  <v-img v-bind:src="$store.getters.getArtWorkBaseUrl + song.album.id">
                  </v-img>
                </v-list-item-avatar>

                <v-list-item-content class="py-0">
                  <v-list-item-title class="text-body-2">{{song.name}}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{song.artist.name}}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="text-caption">
                    play count: {{song.playbackHistory.playCount}}, last: {{song.playbackHistory.lastTimePlayed}}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-list-item-action-text>
                    <div class="text--secondary">
                      {{SONG_DURATION.convertSecondsToMinutesAndSeconds(song.duration)}}
                    </div>
                  </v-list-item-action-text>
                  <v-icon v-if="song.favorite" color="yellow darken-3">mdi-star</v-icon>
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
        <div class="text-center">
          <v-pagination class="pt-0" v-model="pagination.page"
                        @input="showPage"
                        :total-visible="pagination.totalVisible"
                        :length="pagination.length"></v-pagination>
        </div>
      </v-col>
    </v-row>

  </div>
</template>

<script>

import {HTTP_CLIENT} from "@/http/axios-config";
import {SONG_HELPER} from "@/utils/songs-helper";
import {eventBus} from "@/main";

export default {
  name: "LibrarySongsView",
  data() {
    return {
      SONG_DURATION: SONG_HELPER,
      sorting: {
        types: [
          {id: 'PLAY_COUNT',  name: 'Top played',      icon: 'mdi-sort-ascending'},
          {id: 'LAST_PLAYED', name: 'Recently Played', icon: 'mdi-sort-clock-ascending-outline'},
          {id: 'FAVORITES',   name: 'Favorites',       icon: 'mdi-star-outline'}
        ]
      },
      pagination: {
        page: 1,
        totalVisible: 7,
        length: 15
      },
      songs: null
    }
  },
  mounted() {
    this.getSongsFiltered(10, 'PLAY_COUNT');
  },
  methods: {
    playLibrarySongs(songIdx) {
      eventBus.$emit('play-playlist', {songs: this.songs, startSongIdx: songIdx, shuffle: false});
    },
    getSongsFiltered(pageSize, filterType) {
      HTTP_CLIENT.get('/library/songs/?pageSize=' + pageSize + '&filter=' + filterType).then(response => {
        this.songs = response.data
      });
    },
    applyNewFilter(filerType) {

    },
    showPage(pageId) {

    }
  }
}
</script>

<style scoped>

</style>