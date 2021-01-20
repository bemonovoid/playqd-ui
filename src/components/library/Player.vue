<template>
  <div>
    <b-row>
      <b-col class="text-left">
        <b-link v-bind:to="{name: 'Songs', params: {albumId: this.$store.getters.getCurrentAlbumId}}">
          <b-icon style="margin-top: 5px" icon="chevron-left"></b-icon>
          Album
        </b-link>
      </b-col>
      <b-col class="text-right">
        <b-icon icon="info-circle" font-scale="1" @click="showSongInfo()"></b-icon>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-img class="scoped-player-album-art-img" center v-bind:src="this.$store.getters.getCurrentSongArtworkSrc" alt=""></b-img>
      </b-col>
    </b-row>

    <b-row>
      <b-col class="text-left">
        <h6 class="scoped-player-song-name">{{this.$store.getters.getCurrentSongName}}</h6>
      </b-col>
      <b-col class="text-right">
        <b-icon icon="filter-circle"></b-icon>
      </b-col>
    </b-row>

    <b-row>
      <b-col class="text-left">
        <p class="text-left" style="color: darkgrey">{{this.$store.getters.getCurrentArtistName}}</p>
      </b-col>
    </b-row>

    <b-row style="padding-bottom: 0">
      <b-col align="left">
        <b-form-input id="playqd-timeline" type="range" min="0" step="1"
                      @update="updateTimelineCurrentTimeMinutesAndSeconds()"
                      @change="changeAudioCurrentTime()"
                      v-model="player.timeline.currentTime"
                      v-bind:max="this.$store.state.audio.duration">
        </b-form-input>
      </b-col>
    </b-row>

    <b-row style="padding-top: 0">
      <b-col cols="2" align="left">
        <p>{{this.player.timeline.currentTimeInMinutesAndSeconds}}</p>
      </b-col>
      <b-col align="right">
        <p>{{this.$store.getters.getCurrentSongDurationInMinutesAndSeconds}}</p>
      </b-col>
    </b-row>

    <b-row style="margin-bottom: 20px">
      <b-col class="text-right">
        <b-link style="color: inherit">
          <b-icon icon="skip-backward-fill" font-scale="3" @click="playPrevious()"></b-icon>
        </b-link>
      </b-col>
      <b-col>
        <b-link style="color: inherit">
          <b-icon v-if="!this.$store.state.audio.isPlaying" icon="play-fill" font-scale="3" @click="play()"></b-icon>
          <b-icon v-if="this.$store.state.audio.isPlaying" icon="pause-fill" font-scale="3" @click="pause()"></b-icon>
        </b-link>
      </b-col>
      <b-col class="text-left">
        <b-link style="color: inherit">
          <b-icon icon="skip-forward-fill" font-scale="3" @click="playNext()"></b-icon>
        </b-link>
      </b-col>
    </b-row>

    <b-row v-if="this.$store.getters.getCurrentSong.comment.length > 0">
      <b-col>
        <p>{{this.$store.getters.getCurrentSong.comment}}</p>
      </b-col>
    </b-row>

    <PlayerSongInfoModal ref="playerSongInfoModal" v-bind:current-song="this.$store.getters.getCurrentSong"/>

  </div>
</template>

<script>

import {eventBus} from "@/main";
import {HTTP_CLIENT} from "@/http/axios-config"
import PlayerSongInfoModal from '@/components/library/player/PlayerSongInfoModal'
import {BIcon, BIconPlayFill, BIconPauseFill, BIconSkipForwardFill, BIconSkipBackwardFill, BIconVolumeOff, BIconVolumeUp, BIconChevronLeft, BIconInfoCircle, BIconFilterCircle} from 'bootstrap-vue'

export default {
  name: "Player",
  components: {
    BIcon, BIconPlayFill, BIconPauseFill, BIconSkipForwardFill, BIconSkipBackwardFill, BIconVolumeOff, BIconVolumeUp, BIconChevronLeft, BIconInfoCircle, BIconFilterCircle,
    PlayerSongInfoModal
  },
  mounted() {
    document.getElementById('mini-player').hidden = true;
  },
  created() {
    if (!this.$store.getters.getCurrentSong) {
      HTTP_CLIENT.get('/library/songs/' + this.$route.params.songId).then(response => {
        var singleSongArray = [];
        singleSongArray[0] = response.data;
        this.$store.commit('setSongs', {
          songs: singleSongArray,
          playingSongIdx: 0
        });
        eventBus.$emit('player-load');
      });
    } else {
      this.player.timeline.currentTimeInMinutesAndSeconds = this.convertSecondsToMinutesAndSeconds(this.$store.state.audio.currentTime);
    }
    eventBus.$on('audio-current-time-changed', (seconds) => {
      this.updatePlayerCurrentTime(seconds);
    });
  },
  destroyed() {
    document.getElementById('mini-player').hidden = false;
    eventBus.$off('audio-metadata-loaded');
  },
  data() {
    return {
      player: {
        timeline: {
          currentTime: this.$store.state.audio.currentTime,
          currentTimeInMinutesAndSeconds: '0:00'
        },
        volume: {
          current: this.$store.state.audio.volume
        }
      }
    }
  },
  methods: {
    play() {
      eventBus.$emit('player-play');
    },
    playPrevious() {
      if (this.$store.getters.hasPrevSong) {
        this.$store.commit('setCurrentSongToPrev');
        eventBus.$emit('player-load');
      }
    },
    playNext() {
      if (this.$store.getters.hasNextSong) {
        this.$store.commit('setCurrentSongToNext');
        eventBus.$emit('player-load');
      }
    },
    pause() {
      eventBus.$emit('player-set-on-pause');
    },
    changeAudioCurrentTime() {
      eventBus.$emit('player-current-time-changed', this.player.timeline.currentTime);
    },
    updateVolume() {
      eventBus.$emit('player-volume-updated', this.player.volume.current);
    },
    updatePlayerCurrentTime(seconds) {
      this.player.timeline.currentTime = seconds;
      this.player.timeline.currentTimeInMinutesAndSeconds = this.convertSecondsToMinutesAndSeconds(seconds)
    },
    updateTimelineCurrentTimeMinutesAndSeconds() {
      this.player.timeline.currentTimeInMinutesAndSeconds = this.convertSecondsToMinutesAndSeconds(this.player.timeline.currentTime);
    },
    convertSecondsToMinutesAndSeconds(seconds) {
      return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
    },
    showSongInfo() {
      this.$refs.playerSongInfoModal.showSongInfoModal();
    }
  }
}

</script>

<style scoped>
  .scoped-player-song-name {
    color: #E34C2C;
  }
  .scoped-player-song-info {
    color: #8DA290;
  }
  .scoped-player-album-art-img {
    max-height: 275px;
    max-width: 275px;
  }


</style>