<template>

  <div v-if="this.songs">

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
            <v-subheader>Filter songs</v-subheader>
            <v-list-item v-for="(sortType, i) in sorting.types" :key="i" @click="applyNewFilter(sortType.id)">
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

      <v-col class="py-0 pl-0">

        <v-list class="text-left py-0" dense>

          <v-subheader class="text-left display-1 pl-2">Songs</v-subheader>

          <v-list-item-group color="primary">

            <v-list-item v-for="(song, i) in songs" :key="i" @click="playSong(song)">

              <v-list-item-icon class="ml-0 mr-2">
                <v-img class="rounded"
                       max-height="25" max-width="25"
                       v-bind:src="$store.getters.getArtWorkBaseUrl + song.album.id">
                </v-img>
              </v-list-item-icon>

              <v-list-item-content class="py-0">
                <v-list-item-title v-text="song.name"></v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{song.artist.name}}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-action-text>
                  <div class="text--secondary">
                    {{SONG_DURATION.convertSecondsToMinutesAndSeconds(song.duration)}}
                  </div>
                </v-list-item-action-text>
              </v-list-item-action>

            </v-list-item>

          </v-list-item-group>

        </v-list>

        <v-divider/>

      </v-col>

    </v-row>

    <v-row>
      <v-col>
        <div class="text-center">
          <v-pagination class="pt-5" v-model="pagination.page"
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
import {SONG_DURATION} from "@/utils/song-duration";
import {eventBus} from "@/main";

export default {
  name: "LibrarySongsView",
  data() {
    return {
      SONG_DURATION,
      sorting: {
        types: [
          {id: 'play-count',     name: 'Top played'},
          {id: 'play-last-date', name: 'Recently Played'}
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
    HTTP_CLIENT.get('/library/songs/?pageSize=12&filter=PLAY_COUNT').then(response => {
      this.songs = response.data
    });
  },
  methods: {
    playSong(song) {
      eventBus.$emit('play-song', song);
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