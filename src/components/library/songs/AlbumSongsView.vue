<template>

  <div v-if="this.songs.length > 0">

    <v-row>

      <v-col class="pl-0 pt-2 text-left" md="auto">
        <v-btn depressed plain class="text-capitalize text-subtitle-1" @click="routerGoBack()">
          <v-icon left>mdi-arrow-left</v-icon>
          <span>{{this.getBackBtnDisplayName()}}</span>
        </v-btn>
      </v-col>

      <v-col class="pl-0 pt-2 text-right">
        <AlbumSongsDropdownOptionsView :album.sync="album"
                                 :show-song-name-as-file-name.sync="showSongNameAsFileName"/>
      </v-col>

    </v-row>

    <v-row>
      <v-col class="px-0">
        <v-card align="center" elevation="0">

          <v-img contain class="scoped-album-img elevation-5" v-bind:src="this.$store.state.artwork.ofOpenedAlbum"></v-img>

          <v-card-title class="text-center text-body-1" style="display: inherit">{{ album.name }}</v-card-title>

          <v-card-subtitle class="py-0">{{ album.artist.name }}</v-card-subtitle>
          <v-card-subtitle class="py-0">
            <small>{{ album.genre ? album.genre + ' - ' : '' }} {{ album.date ? album.date : '' }}</small>
          </v-card-subtitle>
          <v-card-actions style="display: inherit">

            <v-btn width="160" depressed rounded @click="playAlbum(songs[0])">
              <v-icon left>mdi-play</v-icon>
              <span class="text-capitalize">Play</span>
            </v-btn>

            <v-btn width="160" depressed rounded @click="playAlbumShuffled()">
              <v-icon left>mdi-shuffle-variant</v-icon>
              <span class="text-capitalize">Shuffle</span>
            </v-btn>

          </v-card-actions>

          <v-card-text class="px-2">
            <v-data-table dense
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

              <template v-slot:item.name="{item}">
                {{ showSongNameAsFileName ? item.fileName : item.name }}
              </template>

              <template v-slot:item.duration="{item}">
                <div v-if="isPlayingSongRow(item.id)" class="subtitle-2 text-no-wrap">
                  - {{SONG_DURATION.convertSecondsToMinutesAndSeconds($store.state.audio.duration - $store.state.audio.currentTimeAsInt)}}
                </div>
                <div v-else class="text--secondary">
                  {{SONG_DURATION.convertSecondsToMinutesAndSeconds(item.duration)}}
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
import {SONG_DURATION} from "@/utils/song-duration";

import AlbumSongsDropdownOptionsView from "@/components/library/songs/AlbumSongsDropdownOptionsView";

import {mdiArrowRightDropCircleOutline} from '@mdi/js'

export default {
  name: 'AlbumSongsView',
  components: {
    AlbumSongsDropdownOptionsView,
    mdiArrowRightDropCircleOutline
  },
  props: ['albumData', 'albumFrom'],
  data() {
    return {
      SONG_DURATION,
      backBtnDisplayName: this.backBtnLabel,
      headers: [
          {align: 'center', value: 'orderId', cellClass: 'pa-0'},
          {align: 'start', value: 'name'},
          {align: 'end', value: 'duration'}
      ],
      album: this.albumData,
      songs: [],
      showSongNameAsFileName: false,
      backToView: this.albumFrom
    }
  },
  mounted() {
    HTTP_CLIENT.get('/library/songs/album/' + this.$route.params.albumId).then(response => {
      this.songs = response.data.songs
      if (!this.album) {
        this.album = response.data.album;
      }
      this.album.totalTime = this.songs.length + ' songs, ' + this.album.totalTimeHumanReadable;
      this.$store.commit('setArtworkOfOpenedAlbum', {albumId: this.album.id, src: this.$store.getters.getArtWorkBaseUrl + this.album.id});
    });
  },
  methods: {
    isPlayingSongRow(songId) {
      if (this.$store.state.audio.isPlaying && this.$store.state.playlist.currentSong) {
        return this.$store.state.playlist.currentSong.id === songId;
      }
      return false;
    },
    playAlbum(startSong) {
      eventBus.$emit('play-album', {startSong: startSong, songs: this.songs});
    },
    playAlbumShuffled() {
      eventBus.$emit('play-album-shuffled', {songs: this.songs});
    },
    playSong(song) {
      if (this.$store.state.playlist.id === null || this.$store.state.playlist.id !== this.album.id) {
        this.playAlbum(song);
      } else {
        eventBus.$emit('play-song', song);
      }
    },
    routerGoBack() {
      if (this.backToView) {
        this.$router.back();
      } else {
        this.$router.push({name: 'AlbumsView', query: {artistId: this.album.artist.id}})
      }
    },
    getBackBtnDisplayName() {
      if (this.backToView) {
        return this.backToView === 'genre' ? this.album.genre : this.album.artist.name;
      } else {
        return this.album.artist.name;
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