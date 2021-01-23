<template>

  <div>
    <v-card align="center" elevation="0">

      <v-img contain class="scoped-album-img" v-bind:src="this.album.artworkSrc"></v-img>

      <v-card-title class="text-center text-body-1" style="display: inherit">{{ album.name }}</v-card-title>

      <v-card-subtitle class="py-3">{{ album.artist.name }}</v-card-subtitle>
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

      <v-card-text>
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
            <div v-else class="body-2">
              {{convertSecondsToMinutesAndSeconds(item.duration)}}
            </div>
          </template>

          <template slot="footer">
            <p class="pr-4 pb-5 text-right text--secondary font-weight-light">{{ album.totalTime }}</p>
          </template>

        </v-data-table>
      </v-card-text>

    </v-card>
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
      headers: [
          {align: 'center', value: 'orderId', cellClass: 'pa-0'},
          {align: 'start', value: 'name'},
          {align: 'end', value: 'duration'}
      ],
      album: {id: '', name: '', genre: '', year: '', totalTime: '', artist: {id: '', name: ''}, artworkSrc: ''},
      songs: [],
      searchingArtwork: false
    }
  },
  created() {
    HTTP_CLIENT.get('/library/songs/album/' + this.$route.params.albumId).then(response => {
      this.songs = response.data.songs
      this.album = response.data.album;
      this.album.totalTime = this.songs.length + ' songs, ' + this.album.totalTime;
      this.album.artworkSrc = this.$store.getters.getArtWorkBaseUrl + '?albumId=' + this.album.id;

      eventBus.$emit('toolbar-back-route-changed', {
        album: response.data.album,
        toolBarParams: {
          title: response.data.artist.name,
          routeParams: {name: 'AlbumsView', params: {artistId: response.data.artist.id}}
        }
      });
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
    showAlbumOptions() {
      this.searchingArtwork = true;
      HTTP_CLIENT.get('/artwork/search/?albumId=' + this.album.id).then(response => {
        this.album.artworkSrc = response.data.url;
        this.searchingArtwork = false;
      }).catch((error) => {
        this.searchingArtwork = false;
      });
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