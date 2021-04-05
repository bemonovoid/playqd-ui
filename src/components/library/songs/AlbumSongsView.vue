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
            <v-btn color="#3EA055" class="text-capitalize" plain height="0"
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

            <v-btn class="green--text" width="160" depressed rounded @click="playAlbum(0)">
              <v-icon left>mdi-play</v-icon>
              <span class="text-capitalize">Play</span>
            </v-btn>

            <v-btn class="green--text" width="160" depressed rounded @click="playAlbumShuffled()">
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
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="formatToggleBtn">
              <v-col v-if="formats.length > 1" v-for="format in formats" :key="format.index" class="text-right px-1 pt-5" md="auto">
                <v-btn small text style="text-transform: none" @click="filterByFormat(format)">{{format}}</v-btn>
              </v-col>
            </v-btn-toggle>
            <v-col class="text-right" md="auto">
              <EditAlbumView v-bind:album-data="album" :album-image-found.sync="showAlbumImage"></EditAlbumView>
            </v-col>
          </v-row>

          <v-card-text class="px-2 pt-0">
            <v-list>
              <SongsListView :songs-data="this.songs"></SongsListView>
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
import playlistUtils from "@/utils/playlistUtils";

import EditAlbumView from "@/components/library/albums/EditAlbumView";
import SongsListView from "@/components/library/songs/SongsListView";

export default {
  name: 'AlbumSongsView',
  components: {
    SongsListView,
    EditAlbumView
  },
  props: ['albumData', 'albumFrom'],
  data() {
    return {
      showAlbumImage: true,
      formats: [],
      formatToggleBtn: null,
      selectedFormatIdx: null,
      album: this.albumData,
      songs: []
    }
  },
  mounted() {
    this.findAlbumSongs();
    eventBus.$on('album-data-updated', newAlbumData => {
      this.album.name = newAlbumData.name;
      this.album.genre = newAlbumData.genre;
      this.album.date = newAlbumData.date;
    });
  },
  methods: {
    findAlbumSongs(format) {
      api.getAlbumSongs(this.$route.params.albumId, format).then(response => {
        this.songs = response.data.songs;
        if (!this.album) {
          this.album = this.songs[0].album;
        }
        this.album.totalTime = this.songs.length + ' songs, ' + playlistUtils.secondsToHHmmText(this.album.totalTimeInSeconds);
        if (this.formats.length === 0) {
          this.formats = [...new Set( this.songs.map(s => s.fileExtension)) ];
        }
      });
    },
    filterByFormat(format) {
      this.findAlbumSongs(format);
    },
    imageError() {
      this.showAlbumImage = false;
    },
    findAlbumImage() {
      api.getAlbumImageSrc(this.album.id).then(response => {
        this.showAlbumImage = true;
      })
    },
    playAlbum(songIdx) {
      eventBus.$emit('play-playlist', {songs: this.songs, startSongIdx: songIdx, shuffle: false});
    },
    playAlbumShuffled() {
      playlistUtils.shufflePlaylist(this.songs);
      eventBus.$emit('play-playlist', {songs: this.songs, startSongIdx: 0, shuffle: true});
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