<template>

  <div v-if="this.songs.length > 0">
    <v-row>
      <v-col class="px-0">
        <v-card align="center" elevation="0">

          <v-dialog v-if="showAlbumImage" max-width="500">
            <template v-slot:activator="{on, attrs}">
              <v-img contain class="scoped-album-img elevation-5"
                     v-on="on" v-bind="attrs"
                     :src="$store.getters.getResourceBaseUrl + 'image/' + album.id + '?target=ALBUM'"
                     @error="imageError"></v-img>
            </template>
            <v-card align="center" elevation="5">
              <v-img class="white--text align-end" :src="$store.getters.getResourceBaseUrl + 'image/' + album.id + '?target=ALBUM'">
                <v-card-title>{{this.album.name}}</v-card-title>
              </v-img>
            </v-card>
          </v-dialog>

          <div v-else>
            <v-img class="scoped-album-img elevation-5" src="@/assets/default-album-cover.png"></v-img>
          </div>

          <v-card-title class="text-center text-body-1" style="display: inherit">{{ album.name }}</v-card-title>

          <v-card-subtitle class="py-0">
            <v-btn class="text-capitalize red--text" plain height="0"
                :to="{name: 'AlbumsView', query: {artistId: album.artist.id}}">{{album.artist.name}}
            </v-btn>
          </v-card-subtitle>
          <v-card-subtitle class="py-0">
            <v-btn class="text-capitalize" plain height="0"
              :to="{name: 'AlbumsView', query: {genre: album.genre}}">
              <small>{{ album.genre ? album.genre : ''}} {{ album.date ? ' - '+ album.date : '' }}</small>
            </v-btn>
          </v-card-subtitle>

          <v-card-actions style="display: inherit">

            <v-btn width="160" depressed rounded @click="playAlbum(0)">
              <v-icon left>mdi-play</v-icon>
              <span class="text-capitalize">Play</span>
            </v-btn>

            <v-btn width="160" depressed rounded @click="playAlbumShuffled()">
              <v-icon left>mdi-shuffle-variant</v-icon>
              <span class="text-capitalize">Shuffle</span>
            </v-btn>

          </v-card-actions>

          <v-row>
            <v-col class="pl-6 pt-5 text-left" md="auto">
              <div class="text--secondary">
                {{ album.totalTime }}
              </div>
            </v-col>
            <v-col class="text-right">
              <EditAlbumView v-bind:album-data="album" :album-image-found.sync="showAlbumImage"></EditAlbumView>
            </v-col>
          </v-row>

          <v-card-text class="px-2 pt-0">
            <v-list>
              <v-list-item-group color="error" v-model="selectedSongIdx">
                <template v-for="(song, i) in songs">
                  <v-list-item :key="i" @click="playSong(i)">
                      <v-list-item-icon class="py-0 mr-1">
                        <div v-if="isPlayingSongRow(i)">
                          <v-icon small>mdi-music-circle-outline mdi-spin</v-icon>
                        </div>
                        <div v-else class="text--disabled text-right">
                          <span>{{i + 1}}</span>
                        </div>
                      </v-list-item-icon>
                      <v-list-item-content class="text-left">
                        <v-list-item-title>
                          {{ album.preferences && album.preferences.songNameAsFileName ? song.fileName : song.name }}
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <div v-if="isPlayingSongRow(i)" class="subtitle-2 text-no-wrap">
                          - {{SONG_DURATION.convertSecondsToMinutesAndSeconds($store.state.audio.duration - $store.state.audio.currentTimeAsInt)}}
                        </div>
                        <div v-else class="text--secondary">
                          {{SONG_DURATION.convertSecondsToMinutesAndSeconds(song.duration)}}
                        </div>
                      </v-list-item-action>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>

  </div>

</template>

<script>

import {eventBus} from "@/main";
import api from "@/http/playqdAPI"
import {SONG_HELPER} from "@/utils/songs-helper";

import EditAlbumView from "@/components/library/albums/EditAlbumView";

export default {
  name: 'AlbumSongsView',
  components: {
    EditAlbumView
  },
  props: ['albumData', 'albumFrom'],
  data() {
    return {
      selectedSongIdx: null,
      SONG_DURATION: SONG_HELPER,
      showAlbumImage: true,
      headers: [
          {align: 'center', value: 'orderId', cellClass: 'pa-0'},
          {align: 'start', value: 'name'},
          {align: 'end', value: 'duration'}
      ],
      album: this.albumData,
      songs: []
    }
  },
  mounted() {
    api.getAlbumSongs(this.$route.params.albumId).then(response => {
      this.songs = response.data
      if (!this.album) {
        this.album = this.songs[0].album;
      }
      this.album.totalTime = this.songs.length + ' songs, ' + this.album.totalTimeHumanReadable;
      this.setPlayingSongSelected();
    });
    eventBus.$on('album-data-updated', newAlbumData => {
      this.album.name = newAlbumData.name;
      this.album.genre = newAlbumData.genre;
      this.album.date = newAlbumData.date;
    });
    eventBus.$on('album-preferences-updated', newPreferences => {
      this.album.preferences = newPreferences;
    });
    eventBus.$on('audio-is-playing', () => {
      this.setPlayingSongSelected();
    });
  },
  methods: {
    imageError(error) {
      this.showAlbumImage = false;
    },
    findAlbumImage() {
      api.getAlbumImageSrc(this.album.id).then(response => {
        this.showAlbumImage = true;
      })
    },
    isPlayingSongRow(idx) {
      return idx === this.selectedSongIdx && this.album.id === this.$store.state.playlist.currentSong.album.id;
    },
    setPlayingSongSelected() {
      if (this.$store.state.playlist.currentSong && this.album.id === this.$store.state.playlist.currentSong.album.id) {
        this.selectedSongIdx = this.songs.findIndex((item) => item.id === this.$store.state.playlist.currentSong.id);
      }
    },
    playAlbum(songIdx) {
      eventBus.$emit('play-playlist', {songs: this.songs, startSongIdx: songIdx, shuffle: false});
    },
    playAlbumShuffled() {
      SONG_HELPER.shufflePlaylist(this.songs);
      eventBus.$emit('play-playlist', {songs: this.songs, startSongIdx: 0, shuffle: true});
    },
    playSong(songIdx) {
      if (this.$store.state.playlist.id === null || this.$store.state.playlist.id !== this.album.id || this.$store.state.playlist.songs.length !== this.songs.length) {
        this.playAlbum(songIdx);
      } else {
        eventBus.$emit('play-song', songIdx);
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

</style>