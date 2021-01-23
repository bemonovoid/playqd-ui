<template>
  <div>
    <audio id="audio-player" autoplay
           v-on:loadedmetadata="updateAudioMetadata()"
           v-on:timeupdate="timeUpdate()"
           v-on:ended="playNext()"
           v-on:play="notifyIsPlaying()"
           v-on:pause="notifyIsPaused()">
      <source id="audio-player-source" src="">
    </audio>
  </div>

</template>

<script>

import {eventBus} from "@/main";
import {HTTP_CLIENT} from "@/http/axios-config";

export default {
  name: 'Audio',
  mounted() {
    this.audioDOMElement = document.getElementById('audio-player');
    this.audioSourceDOMElement = document.getElementById('audio-player-source');
    this.audioDOMElement.volume = 0.5;
  },
  created() {
    eventBus.$on('player-set-on-pause', () => {
      this.pause();
    });
    eventBus.$on('player-load', () => {
      this.load();
    });
    eventBus.$on('player-play', () => {
      this.play();
    });
    eventBus.$on('toolbar-player-current-time-changed', (newCurrentTime) => {
      this.$store.commit('setAudioCurrentTime', newCurrentTime);
      this.audioDOMElement.currentTime = newCurrentTime;
    });
    eventBus.$on('toolbar-player-current-volume-changed', (newVolume) => {
      this.$store.commit('setAudioVolume', newVolume);
      this.audioDOMElement.volume = newVolume;
    });
  },
  methods: {
    load() {
      let songId = this.$store.state.playlist.currentSong.id;
      let src = HTTP_CLIENT.defaults.baseURL + "/audio/open/?songId=" + songId;
      this.audioSourceDOMElement.src = src;
      this.audioDOMElement.load();
    },
    play() {
      this.audioDOMElement.play();
    },
    notifyIsPlaying() {
      this.$store.commit('setAudioIsPlaying', true)
    },
    pause() {
      this.audioDOMElement.pause();
    },
    notifyIsPaused() {
      this.$store.commit('setAudioIsPlaying', false)
      eventBus.$emit('audio-play-paused');
    },
    playNext() {
      if (this.$store.getters.hasNextSong) {
        this.$store.commit('setCurrentSongToNext')
        eventBus.$emit('player-load');
      }
    },
    timeUpdate() {
      this.$store.commit('setAudioCurrentTime', this.audioDOMElement.currentTime);
    },
    updateAudioMetadata() {
      this.$store.commit('setAudioProperties', this.getMetadata());
    },
    getMetadata() {
      return {
        paused: this.audioDOMElement.paused,
        volume: this.audioDOMElement.volume,
        currentTime: this.audioDOMElement.currentTime,
        duration: parseInt(this.audioDOMElement.duration, 10)
      };
    }
  }
}
</script>