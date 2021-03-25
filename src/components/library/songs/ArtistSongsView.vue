<template>

  <div v-if="this.songs.length > 0">
    <v-row>
      <v-col class="px-0">
        <v-card align="center" elevation="0">

          <v-dialog v-if="showArtistImage" max-width="500">
            <template v-slot:activator="{on, attrs}">
              <v-img contain class="scoped-artist-img elevation-5"
                     v-on="on" v-bind="attrs"
                     :src="$store.getters.getResourceBaseUrl + 'image/' + artistData.id + '?target=ARTIST'"
                     @error="imageError"></v-img>
            </template>
            <v-card align="center" elevation="5">
              <v-img class="white--text align-end" :src="$store.getters.getResourceBaseUrl + 'image/' + artistData.id + '?target=ARTIST&size=LARGE'">
                <v-card-title>{{this.artistData.name}}</v-card-title>
              </v-img>
            </v-card>
          </v-dialog>

          <div v-else>
            <v-img class="scoped-artist-img elevation-5" src="@/assets/default-album-cover.png"></v-img>
          </div>

          <v-card-title class="text-center text-body-1" style="display: inherit">
            <v-btn class="text-capitalize red--text" plain height="0"
                   :to="{name: 'AlbumsView', query: {artistId: artistData.id}}">{{artistData.name}}
            </v-btn>
          </v-card-title>

          <v-card-actions style="display: inherit">

            <v-btn width="160" depressed rounded @click="playArtist(0)">
              <v-icon left>mdi-play</v-icon>
              <span class="text-capitalize">Play</span>
            </v-btn>

            <v-btn width="160" depressed rounded @click="playArtistShuffled()">
              <v-icon left>mdi-shuffle-variant</v-icon>
              <span class="text-capitalize">Shuffle</span>
            </v-btn>

          </v-card-actions>

          <v-row>
            <v-col class="pl-6 pt-5 text-left" md="auto">
              <div class="text--secondary">
                {{totalTime}}
              </div>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="text-right" md="auto">
              <EditArtistView v-on:close="" v-bind:artist-data="artistData" :artist-image-found.sync="showArtistImage"></EditArtistView>
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
import SongsListView from "@/components/library/songs/SongsListView";
import EditArtistView from "@/components/library/artists/EditArtistView";

export default {
  name: "ArtistSongsView",
  components: {
    EditArtistView,
    SongsListView
  },
  props: ['artistData'],
  data() {
    return {
      showArtistImage: true,
      totalTime: '',
      songs: []
    }
  },
  mounted() {
    api.getArtistSongs(this.artistData.id).then(response => {
      this.songs = response.data.songs;
      let totalSeconds = this.songs.map(song => song.duration).reduce((a, b) => a + b, 0);
      this.totalTime = this.songs.length + ' songs, ' + playlistUtils.secondsToHHmmText(totalSeconds);
    })
  },
  methods: {
    imageError() {
      this.showArtistImage = false;
    },
  }
}
</script>

<style scoped>

.scoped-artist-img {
  max-height: 200px;
  max-width: 200px;
}

</style>