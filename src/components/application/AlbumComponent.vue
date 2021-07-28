<template>
  <div v-if="album">
    <v-row class="pt-10">

      <v-col md="auto">
        <v-img v-if="showAlbumImage" max-width="250" max-height="250"
            :src="$store.getters.getResourceBaseUrl + 'image/' + album.id + '?target=ALBUM'"
            @error="imageError(album.id)">
        </v-img>
        <v-img v-else max-width="250" max-height="250" src="@/assets/default-album-cover.png" ></v-img>
      </v-col>

      <v-col class="text-left pl-0" align-self="end">
        <v-list-item>
          <v-list-item-content class="mb-0 pb-0">
            <v-list-item-subtitle class="pl-2">Album</v-list-item-subtitle>
            <v-list-item-title class="text-h2">
              {{album.name}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-avatar size="25" class="mt-0">
            <v-img v-if="album.artist.images" :src="album.artist.images[0].url" class="elevation-5"></v-img>
            <v-icon v-else color="grey">mdi-music-circle-outline</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-subtitle>
              <span>
                <v-hover v-slot="{ hover }" open-delay="50">
                  <a class="white--text text-caption font-weight-bold" :class="{'text-decoration-underline' : hover}" @click="openArtist(album.artist.id)">{{album.artist.name}}</a>
                </v-hover>
              </span>
              <span class="px-1">&#8226;</span>
              <span>{{album.date}}</span>
              <span class="px-1">&#8226;</span>
              <span>{{album.totalTime}}</span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>

    <v-row>
      <v-col md="auto">
        <v-btn v-if="thisAlbumPlaying" fab color="error" elevation="0" @click="pause">
          <v-icon x-large color="white">mdi-pause</v-icon>
        </v-btn>
        <v-btn v-else fab color="error" elevation="0" @click="playAll">
          <v-icon x-large color="white">mdi-play</v-icon>
        </v-btn>
      </v-col>
      <v-col class="text-left" align-self="center">
        <v-btn icon large elevation="0">
          <v-icon color="black">mdi-dots-horizontal</v-icon>
        </v-btn>
      </v-col>

    </v-row>

    <v-row>
      <v-col align-self="start" >
        <v-data-table class="mb-15 pb-10 mr-15 pr-10"
                      height="950"
                      v-model="selectedSong"
                      single-select
                      @dblclick:row="playTableRowSong"
                      fixed-header
                      :headers="tableHeaders"
                      :items="songs"
                      :items-per-page="songs.length"
                      :server-items-length="songs.length"
                      :loading="dataLoading"
                      loading-text="Loading songs... Please wait"
                      hide-default-footer>

          <template v-slot:item="{ item, index }">
            <v-hover v-slot="{ hover }">

              <tr>
                <td>

                  <v-btn v-if="$store.state.playlist.nowPlaying && $store.state.playlist.nowPlaying.id === item.id" small icon @click="resumePauseNowPlaying($store.state.audio.isPlaying)">
                    <v-icon color="red">{{$store.state.audio.isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                  </v-btn>
                  <v-btn v-else small icon :class="{ 'table-cell-hover': hover}" @click="playIndexSong(item, index)">{{hover ? '' : index + 1}}
                    <v-icon v-show="hover" :class="{ 'table-cell-hover': hover}">mdi-play</v-icon>
                  </v-btn>
                </td>

                <td class="ml-0 pl-0">
                  <v-list-item dense>
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold" :class="{'red--text': selectedSong[0] && selectedSong[0].id === item.id}">{{item.name}}</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-hover v-slot="{ hover }">
                          <a class="text--secondary" :class="{'text-decoration-underline' : hover}" @click="openArtist(item.artist.id)">{{item.artist.name}}</a>
                        </v-hover>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </td>

                <td>
                  <v-btn :class="{'table-cell-hover-new' : hover}" icon @click="whatIsValue(item, index)" color="rgba(255, 255, 255, 0)">
                    <v-icon small :class="{'table-cell-hover-new' : hover}" color="rgba(255, 255, 255, 0)">mdi-heart-outline</v-icon>
                  </v-btn>
                </td>

                <td>
                  {{ playlistUtils.secondsToHHmmss(item.duration) }}
                </td>

                <td>
                  <v-tooltip bottom open-delay="400">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" :class="{'table-cell-hover-new' : hover}" icon  @click="whatIsValue(item, index)" color="rgba(255, 255, 255, 0)">
                        <v-icon :class="{'table-cell-hover-new' : hover}" color="rgba(255, 255, 255, 0)">mdi-dots-horizontal</v-icon>
                      </v-btn>
                    </template>
                    <span>More</span>
                  </v-tooltip>
                </td>
              </tr>
            </v-hover>
          </template>

        </v-data-table>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import api from "@/http/playqdAPI";
import playlistUtils from "@/utils/playlistUtils";
import {eventBus} from "@/main";

export default {
  name: "AlbumComponent",
  data() {
    return {
      showAlbumImage: true,
      album: null,
      dataLoading: false,
      songs: [],
      playlistUtils: playlistUtils,
      selectedSong: [],
      tableHeaders: [
        {text: '#',     align: 'center', sortable: false, value: 'idx'},
        {text: 'Title', align: 'start', sortable: false, value: 'name', width: '95%'},
        {text: '',      align: 'end',   sortable: false, value: 'fav'},
        {text: 'Time',  align: 'start',   sortable: false, value: 'time'},
        {text: '',      align: 'end',   sortable: false, value: 'more'}
      ]
    }
  },
  computed: {
    thisAlbumLoaded: function () {
      return this.album && this.$store.state.playlist.nowPlaying && this.$store.state.playlist.nowPlaying.album.id === this.album.id;
    },
    thisAlbumPlaying: function () {
      return this.album && this.$store.state.playlist.nowPlaying && this.$store.state.playlist.nowPlaying.album.id === this.album.id && this.$store.state.audio.isPlaying;
    }
  },
  mounted() {
    this.findAlbumSongs();
    eventBus.$on('song-can-play', () => {
      this.selectRow(this.$store.state.playlist.nowPlaying);
    });
  },
  methods: {
    findAlbumSongs() {
      this.dataLoading = true;
      api.getAlbumSongs(this.$route.params.albumId).then(response => {
        this.dataLoading = false;
        this.songs = response.data.songs;
        this.album = this.songs[0].album;
        this.album.totalTime = this.songs.length + ' songs, ' + playlistUtils.secondsToHHmmText(this.album.totalTimeInSeconds);
        if (this.thisAlbumLoaded) {
          this.selectRow(this.$store.state.playlist.nowPlaying);
        }
      });
    },
    imageError() {
      this.showAlbumImage = false;
    },
    selectRow(song) {
      this.selectedSong = [song];
    },
    openArtist(artistId) {
      this.$router.push({name: 'ArtistComponent', params: {artistId: artistId}})
    },
    playAll() {
      if (this.thisAlbumLoaded) {
        eventBus.$emit('resume-play');
      } else {
        this.play(this.songs[0], this.songs);
      }
    },
    playTableRowSong(event, row) {
      this.play(row.item, this.songs.slice(row.index));
    },
    playIndexSong(song, index) {
      this.play(song, this.songs.slice(index));
    },
    play(song, newPlaylist) {
      this.$store.commit('setPlaylist', {nowPlaying: song, songs: newPlaylist});
      eventBus.$emit('play');
      this.selectRow(song);
    },
    pause() {
      eventBus.$emit('pause');
    },
    resumePauseNowPlaying(isPlaying) {
      if (isPlaying) {
        this.pause();
      } else {
        eventBus.$emit('resume-play');
      }
    },
    whatIsValue(item) {

    }
  }
}
</script>

<style scoped>

.table-cell-hover {
  color: red;
}

.table-cell-hover-new {
  color: rgba(255, 255, 255, 1) !important;
}

</style>