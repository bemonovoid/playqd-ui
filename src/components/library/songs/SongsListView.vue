<template>

  <v-list dense two-line class="py-0">

    <v-list-item-group color="error" v-model="selectedSongIdx">
      <template v-for="(song, i) in songsData">

        <v-list-item class="px-1" @click="playSong(i)">

          <v-list-item-avatar v-if="libraryList" class="ml-0 mr-2">
            <v-img v-if="songAlbumsWithImageNotFound.includes(song.album.id)" src="@/assets/default-album-cover.png" ></v-img>
            <v-img v-else :src="$store.getters.getResourceBaseUrl + 'image/' + song.album.id + '?target=ALBUM'" alt="alt" @error="imageError(song.album.id)"></v-img>
          </v-list-item-avatar>

          <v-list-item-icon v-else class="py-0 mr-1">
            <div v-if="isPlayingSongRow(i, song.id)">
              <v-icon>mdi-music-circle-outline mdi-spin</v-icon>
            </div>
            <div v-else class="pt-2 text--disabled text-right">
              <span>{{i + 1}}</span>
            </div>
          </v-list-item-icon>

          <v-list-item-content class="text-left">

            <v-list-item-title class="text-body-1">
              {{ song.name }}
            </v-list-item-title>

            <v-list-item-subtitle class="text--secondary">{{song.artist.name}}</v-list-item-subtitle>
            <v-list-item-subtitle>
              <small>
                {{song.fileExtension}} | {{song.audioBitRate}} kbps | {{song.audioSampleRate}} Hz
              </small>
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-list-item-action-text>
              <div v-if="isPlayingSongRow(i, song.id)" class="subtitle-2 text-no-wrap">
                - {{ playlistUtils.secondsToHHmmss($store.state.audio.duration - $store.state.audio.currentTimeAsInt) }}
              </div>
              <div v-else class="text--secondary">
                {{ playlistUtils.secondsToHHmmss(song.duration) }}
              </div>
            </v-list-item-action-text>
            <v-icon small v-text="song.favorite === true ? 'mdi-star' : 'mdi-star-outline'" :color="song.favorite === true ? 'yellow darken-3' : ''"></v-icon>
          </v-list-item-action>

        </v-list-item>
        <v-divider></v-divider>
      </template>
    </v-list-item-group>

  </v-list>

</template>

<script>

import {eventBus} from "@/main";
import playlistUtils from "@/utils/playlistUtils";

export default {
  name: "SongsListView",
  props: ['songsData', 'libraryList', 'artistList', 'albumList'],
  data() {
    return {
      playlistUtils: playlistUtils,
      songAlbumsWithImageNotFound: [],
      selectedSongIdx: null,
    }
  },
  mounted() {
    eventBus.$on('audio-is-playing', () => {
      this.setPlayingSongSelected();
    });
  },
  methods: {
    isPlayingSongRow(idx, songId) {
      return this.$store.state.playlist.currentSong && this.$store.state.playlist.currentSong.id === songId && idx === this.selectedSongIdx;
    },
    setPlayingSongSelected() {
      this.selectedSongIdx = this.songsData.findIndex((item) => item.id === this.$store.state.playlist.currentSong.id);
    },
    playSong(songIdx) {
      eventBus.$emit('play-playlist', {songs: this.songsData, startSongIdx: songIdx, shuffle: false});
    },
    imageError(albumId) {
      this.songAlbumsWithImageNotFound.push(albumId);
    }
  }
}
</script>

<style scoped>

</style>