<template>

  <div v-if="this.songs.length > 0">
    <v-row>
      <v-col class="px-0">
        <v-card align="center" elevation="0">

          <v-img contain class="scoped-album-img elevation-5" v-bind:src="this.$store.state.artwork.ofOpenedAlbum"></v-img>

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
              <EditAlbumView v-bind:album-data="album"></EditAlbumView>
              <AlbumSongsDropdownOptionsView :album.sync="album" :show-song-name-as-file-name.sync="replaceSongNameWithFileName"/>
            </v-col>
          </v-row>

          <v-card-text class="px-2 pt-0">
            <v-list>
              <template v-for="(song, i) in songs">
                <v-list-item :key="i" @click="playSong(i)">
                    <v-list-item-icon class="py-0 mr-1">
                      <div class="text--disabled text-right">
                        <span>{{i + 1}}</span>
                      </div>
                    </v-list-item-icon>
                    <v-list-item-content class="text-left">
                      <v-list-item-title>
                        {{ replaceSongNameWithFileName ? song.fileName : song.name }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <div v-if="isPlayingSongRow(song.id)" class="subtitle-2 text-no-wrap">
                        - {{SONG_DURATION.convertSecondsToMinutesAndSeconds($store.state.audio.duration - $store.state.audio.currentTimeAsInt)}}
                      </div>
                      <div v-else class="text--secondary">
                        {{SONG_DURATION.convertSecondsToMinutesAndSeconds(song.duration)}}
                      </div>
                    </v-list-item-action>
                </v-list-item>
                <v-divider></v-divider>
              </template>
            </v-list>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>

  </div>

</template>

<script>

import {eventBus} from "@/main";
import {HTTP_CLIENT} from "@/http/axios-config";
import {SONG_HELPER} from "@/utils/songs-helper";

import AlbumSongsDropdownOptionsView from "@/components/library/songs/AlbumSongsDropdownOptionsView";

import {mdiArrowRightDropCircleOutline} from '@mdi/js'
import EditAlbumView from "@/components/library/songs/EditAlbumView";

export default {
  name: 'AlbumSongsView',
  components: {
    EditAlbumView,
    AlbumSongsDropdownOptionsView,
    mdiArrowRightDropCircleOutline
  },
  props: ['albumData', 'albumFrom'],
  data() {
    return {
      SONG_DURATION: SONG_HELPER,
      backBtnDisplayName: this.backBtnLabel,
      headers: [
          {align: 'center', value: 'orderId', cellClass: 'pa-0'},
          {align: 'start', value: 'name'},
          {align: 'end', value: 'duration'}
      ],
      album: this.albumData,
      songs: [],
      replaceSongNameWithFileName: false
    }
  },
  computed: {
    playingSongId: function () {
      if (this.$store.state.playlist.currentSong && this.$store.state.audio.isPlaying) {
        return this.$store.state.playlist.currentSong.id;
      }
      return null;
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
    eventBus.$on('album-data-updated', newAlbumData => {
      this.album.name = newAlbumData.name;
      this.album.genre = newAlbumData.genre;
      this.album.date = newAlbumData.date;
      if (newAlbumData.artworkSrc.length > 0) {
        this.$store.commit('setArtworkOfOpenedAlbum', {albumId: this.album.id, src: newAlbumData.artworkSrc});
      }
    })
  },
  methods: {
    isPlayingSongRow(songId) {
      if (this.$store.state.audio.isPlaying && this.$store.state.playlist.currentSong) {
        return this.$store.state.playlist.currentSong.id === songId;
      }
      return false;
    },
    playAlbum(songIdx) {
      eventBus.$emit('play-playlist', {songs: this.songs, startSongIdx: songIdx, shuffle: false});
    },
    playAlbumShuffled() {
      SONG_HELPER.shufflePlaylist(this.songs);
      eventBus.$emit('play-playlist', {songs: this.songs, startSongIdx: 0, shuffle: true});
    },
    playSong(songIdx) {
      if (this.$store.state.playlist.id === null || this.$store.state.playlist.id !== this.album.id) {
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