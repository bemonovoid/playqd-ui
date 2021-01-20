<template>

  <div>

    <b-row>

      <b-col class="text-left">
        <b-link @click="returnToAlbum()">
          <b-icon class="scoped-return-link" icon="chevron-left"></b-icon>
          {{album.name}}
        </b-link>
      </b-col>

      <b-col class="text-right">
<!--        <b-icon icon="text-indent-right" font-scale="2" @click="showAlbumOptions()"></b-icon>-->
        <b-dropdown id="dropdown-dropleft" dropleft text="Drop-Left" variant="primary" class="m-2">
          <b-dropdown-item v-if="this.album.artworkStatus === 'UNKNOWN'" @click="showAlbumOptions()">Resolve artwork online</b-dropdown-item>
          <b-dropdown-item href="#">Another action</b-dropdown-item>
          <b-dropdown-item href="#">Something else here</b-dropdown-item>
        </b-dropdown>
      </b-col>

    </b-row>

    <b-row>
      <b-col>
        <div v-if="searchingArtwork">
          <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
        </div>
        <div v-else class="scoped-album-img-div">
          <b-img class="scoped-album-img" center v-bind:src="this.album.artworkSrc"></b-img>
        </div>
        <div class="scoped-album-name-div">
          <h4>{{album.name}}</h4>
        </div>
        <h5 class="scoped-songs-artist-name">{{album.artist.name}}</h5>
        <small>{{album.genre ? album.genre + ' - ' : ''}} {{album.year ? album.year : ''}}</small>
      </b-col>
    </b-row>

    <b-row class="scoped-album-audio-controls-row">
      <b-col class="text-right">
        <b-button class="scoped-album-audio-controls" pill variant="outline-danger" @click="playAlbum(0)">
          <b-icon icon="play"></b-icon>
          Play
        </b-button>
      </b-col>
      <b-col class="text-left">
        <b-button class="scoped-album-audio-controls" pill variant="outline-danger" @click="playAlbumShuffled()">
          <b-icon icon="shuffle"></b-icon>
          Shuffle
        </b-button>
      </b-col>
    </b-row>

    <b-table selectable select-mode="single" hover class="scoped-songs-table text-left" foot-clone
             ref="songsTableRef"
             :items="songs"
             :fields="songsTable.fields"
             @row-selected="rowSelected"
             thead-class="d-none">

      <template #cell(index)="data">
        <div class="text-center">
          <template v-if="isPlayingSongRow(data)">
            <b-icon icon="disc" animation="spin" variant="danger"></b-icon>
          </template>
          <template v-else>
            <b-form-text disabled>{{data.index + 1}}</b-form-text>
          </template>
        </div>
      </template>

      <template #cell(name)="data">
        <div class="text-left">{{data.item.name}}</div>
      </template>

      <template #cell(timeInSeconds)="data">
        <template v-if="isPlayingSongRow(data)">
          <b-form-text class="text-center" disabled style="white-space:nowrap">
            {{timeInSecondsLeft}}
          </b-form-text>
        </template>
        <template v-else>
          <b-form-text class="text-right" disabled>
            {{convertSecondsToMinutesAndSeconds(data.item.duration)}}
          </b-form-text>
        </template>
      </template>

      <template #foot(index)="data"><div/></template>

      <template #foot(name)="data"><div/></template>

      <template #foot(timeInSeconds)="data"><div/></template>

    </b-table>

    <b-row class="text-right">
      <b-col>
        <small>{{album.totalTime}}</small>
      </b-col>
    </b-row>

  </div>
</template>

<script>

import {BIcon, BIconChevronLeft, BIconPlay, BIconShuffle, BIconDisc, BIconTextIndentRight} from 'bootstrap-vue'
import {eventBus} from "@/main";
import {HTTP_CLIENT} from "@/http/axios-config";
// import {PAGE_TITLE_UTILS} from "@/utils/page-title-utils";

export default {
  name: 'Songs',
  components: {
    BIcon, BIconChevronLeft, BIconPlay, BIconShuffle, BIconDisc, BIconTextIndentRight
  },
  data() {
    return {
      songsTable: {
        fields: [
            {key: 'index', thStyle: {width: '20px'}},
            {key: 'name'},
            {key: 'timeInSeconds', thStyle: {width: '40px'}}
          ]
      },
      album: {id: '', name: '', genre: '', year: '', totalTime: '', artist: {id: '', name: ''}, artworkSrc: ''},
      songs: [],
      timeInSecondsLeft: '',
      searchingArtwork: false
    }
  },
  created() {
    let albumId = this.$route.params.albumId;
    HTTP_CLIENT.get('/library/songs/album/' + albumId).then(response => {
      this.artist = response.data.artist;
      this.songs = response.data.songs
      this.album = response.data.album;
      this.album.totalTime = this.songs.length + ' songs, ' + this.album.totalTime;
      this.album.artworkSrc = this.$store.getters.getArtWorkBaseUrl + '?albumId=' + this.album.id;
    });
    eventBus.$on('audio-current-time-changed', (seconds) => {
      let secondsLeft = this.$store.getters.getCurrentSong.duration - seconds;
      this.timeInSecondsLeft = "- " + this.convertSecondsToMinutesAndSeconds(secondsLeft);
    });
  },
  methods: {
    isPlayingSongRow(data) {
      if (this.$store.getters.audioIsPlaying) {
        let rowSongId = data.item.id;
        let currentSong = this.$store.getters.getCurrentSong;
        return currentSong && currentSong.id === rowSongId;
      }
      return false;
    },
    returnToAlbum() {
      this.$router.push({name: "Albums", params: {artistId: this.album.artist.id}})
    },
    rowSelected(items) {
      let idx = this.songs
          .map((item, index) => {return {id: item.id, idx: index}})
          .filter((item) => item.id === items[0].id)[0].idx;
      this.playAlbum(idx);
    },
    playAlbum(songIndex) {
      this.$store.commit('setSongs', {
        songs: this.songs,
        playingSongIdx: songIndex
      });
      eventBus.$emit('player-load')
      // let currentSong = this.$store.getters.getCurrentSong
      // PAGE_TITLE_UTILS.setPageTitle(currentSong.artist.name +  " - " + currentSong.name);
    },
    playAlbumShuffled() {
      //TODO
      // min = Math.ceil(min);
      // max = Math.floor(max);
      // return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    convertSecondsToMinutesAndSeconds(seconds) {
      return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
    },
    showAlbumOptions() {
      this.searchingArtwork = true;
      HTTP_CLIENT.get('/artwork/search/?albumId=' + this.album.id).then(response => {
        console.log(response.data);
        this.album.artworkSrc = response.data.url;
        this.searchingArtwork = false;
      }).catch((error) => {
        console.log(error);
        this.searchingArtwork = false;
      });
    }
  }
}
</script>

<style scoped>

  .scoped-return-link {
    margin-top: 5px;
  }
  .scoped-album-img-div {
    margin-top: 10px;
  }
  .scoped-album-img {
    max-height: 200px;
    max-width: 200px;
  }
  .scoped-album-audio-controls-row {
    margin-top: 10px;
  }
  .scoped-album-audio-controls {
    width: 150px;
  }
  .scoped-songs-table {
    margin-top: 10px;
  }
  .scoped-album-name-div {
    margin-top: 5px;
  }
  .scoped-songs-artist-name {
    color: #E34C2C;
  }

</style>