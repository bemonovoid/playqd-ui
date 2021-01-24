<template>

  <div>

    <v-row>

      <v-col class="pl-0 pt-2 text-left" md="auto">
        <v-btn depressed plain class="text-capitalize text-subtitle-1" v-bind:to="backToView">
          <v-icon left>mdi-arrow-left</v-icon>
          <span>{{this.album.artist.name}}</span>
        </v-btn>
      </v-col>

      <v-col class="pl-0 pt-2 text-right">
        <v-bottom-sheet inset persistent v-model="songMenuOptions.enable">

          <template v-slot:activator="{attrs, on}">
            <v-btn icon fab small v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <v-sheet class="text-center">

            <v-card elevation="1">

              <v-toolbar color="grey lighten-3" elevation="0">

                <div class="py-2 pr-3">
                  <v-img max-height="50px" max-width="50px" v-bind:src="this.album.artworkSrc"></v-img>
                </div>

                <v-toolbar-title>
                  <div class="caption px-2 text-left text-truncate">
                    {{this.album.artist.name}}
                  </div>
                  <div class="caption px-2 text-left text-truncate">
                    <small>{{ this.album.name}}</small>
                  </div>
                </v-toolbar-title>

                <v-spacer></v-spacer>
                <v-btn icon @click="songMenuOptions.enable = !songMenuOptions.enable">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>

              <v-divider/>

              <v-list dense subheader>

                <v-list-item class="text-left"
                             @click="resolveArtworkOnline()"
                             :disabled="this.album.artworkStatus !== 'UNKNOWN'">

                  <v-list-item-content>
                    <v-list-item-title>Resolve artwork online</v-list-item-title>
                    <v-list-item-subtitle class="text-wrap">Search for album artist online and try to resolve the artwork</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action v-if="this.artworkSearchInProgress">
                    <v-progress-circular size="20" indeterminate color="grey"></v-progress-circular>
                  </v-list-item-action>

                  <v-list-item-action v-else>
                    <v-btn icon>
                      <v-icon color="grey lighten-1">mdi-image-search-outline</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>

                <v-divider/>

                <v-list-item>
                  <v-list-item-content>Play next</v-list-item-content>
                </v-list-item>

                <v-divider/>

                <v-list-item>
                  <v-list-item-content>Play prev</v-list-item-content>
                </v-list-item>

              </v-list>

            </v-card>

          </v-sheet>
        </v-bottom-sheet>
      </v-col>

    </v-row>

    <v-row>
      <v-col class="px-0">
        <v-card align="center" elevation="0">

          <v-img contain class="scoped-album-img" v-bind:src="this.album.artworkSrc"></v-img>

          <v-card-title class="text-center text-body-1" style="display: inherit">{{ album.name }}</v-card-title>

          <v-card-subtitle class="py-0">{{ album.artist.name }}</v-card-subtitle>
          <v-card-subtitle class="py-0">
            <small>{{ album.genre ? album.genre + ' - ' : '' }} {{ album.year ? album.year : '' }}</small>
          </v-card-subtitle>
          <v-card-actions style="display: inherit">

            <v-btn width="160" depressed rounded @click="playAlbum(songs[0].id)">
              <v-icon left>mdi-play</v-icon>
              <span class="text-capitalize">Play</span>
            </v-btn>

            <v-btn width="160" depressed rounded @click="playAlbumShuffled()">
              <v-icon left>mdi-shuffle-variant</v-icon>
              <span class="text-capitalize">Shuffle</span>
            </v-btn>

          </v-card-actions>

          <v-card-text class="px-2">
            <v-data-table
                hide-default-header
                hide-default-footer
                disable-pagination
                disable-filtering
                :headers="headers"
                :items="songs"
                @click:row="playSong"
                mobile-breakpoint="300"
                item-key="orderId">

              <template v-slot:item.orderId="{item, index}">
                <div v-if="isPlayingSongRow(item.id)">
                  <v-icon color="blue lighten-2">mdi-arrow-right-drop-circle-outline</v-icon>
                </div>
                <div class="text--disabled" v-else style="min-width: 25px">
                  {{index + 1}}
                </div>
              </template>

              <template v-slot:item.duration="{item}">
                <div v-if="isPlayingSongRow(item.id)" class="subtitle-2 text-no-wrap">
                  - {{convertSecondsToMinutesAndSeconds($store.state.audio.duration - $store.state.audio.currentTimeAsInt)}}
                </div>
                <div v-else class="text--secondary">
                  {{convertSecondsToMinutesAndSeconds(item.duration)}}
                </div>
              </template>

              <template slot="footer">
                <p class="pr-4 pb-5 text-right text--secondary font-weight-light">{{ album.totalTime }}</p>
              </template>

            </v-data-table>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>


  </div>

</template>

<script>

import {eventBus} from "@/main";
import {HTTP_CLIENT} from "@/http/axios-config";
import {mdiArrowRightDropCircleOutline} from '@mdi/js'
// import {PAGE_TITLE_UTILS} from "@/utils/page-title-utils";

export default {
  name: 'SongsView',
  components: {
    mdiArrowRightDropCircleOutline
  },
  data() {
    return {
      songMenuOptions: {
        enable: false
      },
      headers: [
          {align: 'center', value: 'orderId', cellClass: 'pa-0'},
          {align: 'start', value: 'name'},
          {align: 'end', value: 'duration'}
      ],
      album: {id: '', name: '', genre: '', year: '', totalTime: '', artist: {id: '', name: ''}, artworkSrc: ''},
      songs: [],
      artworkSearchInProgress: false,
      backToView: {name: 'AlbumsView', query: {artistId: ''}}
    }
  },
  created() {
    HTTP_CLIENT.get('/library/songs/album/' + this.$route.params.albumId).then(response => {
      this.songs = response.data.songs
      this.album = response.data.album;
      this.album.totalTime = this.songs.length + ' songs, ' + this.album.totalTime;
      this.album.artworkSrc = this.$store.getters.getArtWorkBaseUrl + '?albumId=' + this.album.id;
      this.backToView.query.artistId = this.album.artist.id;
    });
  },
  methods: {
    isPlayingSongRow(songId) {
      if (this.$store.state.audio.isPlaying && this.$store.state.playlist.currentSong) {
        return this.$store.state.playlist.currentSong.id === songId;
      }
      return false;
    },
    playAlbum(startSongId) {
      this.$store.commit('setPlaylist', {
        playlistId: this.album.id,
        shuffle: false,
        startFromSongId: startSongId,
        songs: this.songs
      });
      eventBus.$emit('player-load')
    },
    playAlbumShuffled() {
      this.$store.commit('setPlaylist', {
        playlistId: this.album.id,
        shuffle: true,
        songs: this.songs
      });
      eventBus.$emit('player-load')
    },
    playSong(song) {
      if (this.$store.state.playlist.id === null || this.$store.state.playlist.id !== this.album.id) {
        this.playAlbum(song.id);
      } else {
        this.$store.commit('setCurrentSongToId', song.id);
        eventBus.$emit('player-load');
      }
    },
    convertSecondsToMinutesAndSeconds(seconds) {
      return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
    },
    resolveArtworkOnline() {
      if (this.album.artworkStatus === 'UNKNOWN') {
        this.artworkSearchInProgress = true;
        HTTP_CLIENT.get('/artwork/search/?albumId=' + this.album.id).then(response => {
          this.artworkSearchInProgress = false;
          this.album.artworkSrc = response.data.url;
        }).catch((error) => {
          alert('Failed to resolve artwork')
          this.artworkSearchInProgress = false;
        });
      }
    }
  }
}
</script>

<style scoped>

.scoped-album-img {
  max-height: 200px;
  max-width: 200px;
}

.scoped-album-name-div {
  margin-top: 5px;
}

.scoped-songs-artist-name {
  color: #E34C2C;
}

</style>