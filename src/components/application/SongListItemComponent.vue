<template>

  <v-hover v-slot="{ hover }">

    <v-list-item dense :class="{'songListItem': hover}">

      <div class="pr-2">
        <div v-if="$store.state.playlist.nowPlaying.id === song.id">
          <v-btn small icon @click="resumePauseNowPlaying(song, $store.state.audio.isPlaying)">
            <v-icon color="red">{{$store.state.audio.isPlaying ? 'mdi-pause' : 'mdi-play'}}</v-icon>
          </v-btn>
        </div>
        <div v-else>
          <v-btn v-if="hover" small icon @click="playSongFromQueue(song)">
            <v-icon color="lightgrey">mdi-play</v-icon>
          </v-btn>
          <v-btn v-else class="text-subtitle-2" small icon disabled>{{listItemIndex}}</v-btn>
        </div>
      </div>

      <v-list-item-avatar tile size="40">
        <v-img v-if="showAlbumImage" :src="$store.getters.getResourceBaseUrl + 'image/' + song.album.id + '?target=ALBUM'" @error="imageError"></v-img>
        <v-img v-else src="@/assets/default-album-cover.png"></v-img>
      </v-list-item-avatar>

      <v-list-item-content class="pl-5">
        <v-row>

          <v-col align-self="center">
            <v-list-item-title class="font-weight-bold">{{song.name}}</v-list-item-title>
            <v-list-item-subtitle>
              <v-hover v-slot="{ hover }">
                <a class="text--secondary text-caption" :class="{'text-decoration-underline' : hover}" @click="openArtist(song.artist.id)">{{song.artist.name}}</a>
              </v-hover>
            </v-list-item-subtitle>
          </v-col>

          <v-col class="text-left" align-self="center">
            <v-hover v-slot="{ hover }">
              <a class="text-caption text--secondary" :class="{'text-decoration-underline' : hover}" @click="openAlbum(song.album)">{{song.album.name}}</a>
            </v-hover>
          </v-col>

          <v-col class="text-right shrink" align-self="center" >
            <v-btn :class="{'table-cell-hover-new' : hover}" icon color="rgba(255, 255, 255, 0)">
              <v-icon small :class="{'table-cell-hover-new' : hover}" color="rgba(255, 255, 255, 0)">mdi-heart-outline</v-icon>
            </v-btn>
          </v-col>

          <v-col class="text-left shrink" align-self="center">
            <span class="text--secondary text-ca">
              {{playlistUtils.secondsToHHmmss(song.duration)}}
            </span>
          </v-col>

          <v-col class="shrink" align-self="center">
            <v-tooltip bottom open-delay="400">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" :class="{'table-cell-hover-new' : hover}" icon color="rgba(255, 255, 255, 0)">
                  <v-icon :class="{'table-cell-hover-new' : hover}" color="rgba(255, 255, 255, 0)">mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <span>More</span>
            </v-tooltip>
          </v-col>

        </v-row>
      </v-list-item-content>
    </v-list-item>
  </v-hover>
</template>

<script>

import {eventBus} from "@/main";
import playlistUtils from "@/utils/playlistUtils";

export default {
  name: "SongListItemComponent",
  props: ['song', 'index', 'showAlbumDetails'],
  data() {
    return {
      playlistUtils: playlistUtils,
      showAlbumImage: true
    }
  },
  computed: {
    listItemIndex: function () {
      return this.$store.state.playlist.nowPlaying.id === this.song.id ? 1 : this.index + 2;
    },
    progress: function () {
      if (this.$store.state.audio.currentTimeAsInt >= this.song.duration) {
        return 0;
      }
      return (this.$store.state.audio.currentTimeAsInt * 100) / this.song.duration;
    }
  },
  methods: {
    playSongFromQueue(song) {
      this.$store.commit('setPlaylistQueue', {nowPlaying: song, queue: this.$store.state.playlist.queue.slice(this.index)});
      eventBus.$emit('play');
    },
    resumePauseNowPlaying(song, isPlaying) {
      if (isPlaying) {
        eventBus.$emit('pause');
      } else {
        eventBus.$emit('resume-play');
      }
    },
    openArtist(artistId) {
      this.$router.push({name: 'ArtistComponent', params: {artistId: artistId}})
    },
    openAlbum(album) {
      this.$router.push({name: 'AlbumComponent', params: {albumId: album.id, albumProp: album}});
    },
    imageError() {
      this.showAlbumImage = false;
    }
  }
}
</script>

<style scoped>
.songListItem {
  background-color: dimgray;
}
.table-cell-hover-new {
  color: rgba(255, 255, 255, 1) !important;
}
</style>;