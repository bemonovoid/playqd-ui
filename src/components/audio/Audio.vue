<template>
  <div>
    <audio id="audio-player" autoplay
           v-on:loadstart="onAudioLoadStart()"
           v-on:loadedmetadata="onAudioLoadedMetadata()"
           v-on:timeupdate="onAudioTimeUpdate()"
           v-on:ended="onAudioEnded()"
           v-on:canplay="onAudioCanPlay()"
           v-on:play="onAudioPlay()"
           v-on:pause="onAudioPause()">
      <source id="audio-player-source" src="">
    </audio>
  </div>

</template>

<script>

import {eventBus} from "@/main";
import api from "@/http/playqdAPI";
import playlistUtils from "@/utils/playlistUtils";

export default {
  name: 'Audio',
  mounted() {
    this.audioDOMElement = document.getElementById('audio-player');
    this.audioSourceDOMElement = document.getElementById('audio-player-source');
    this.audioDOMElement.volume = 0.5;
  },
  created() {
    eventBus.$on('new-current-time', (newCurrentTime) => {
      this.audioDOMElement.currentTime = newCurrentTime;
    });
    eventBus.$on('volume-changed', (volume) => {
      this.audioDOMElement.volume = volume;
    });
    eventBus.$on('pause', () => {
      this.pause();
    });
    eventBus.$on('resume-play', () => {
      this.play();
    });
    eventBus.$on('play-next', () => {
      this.loadNextSong();
    });
    eventBus.$on('play-previous', () => {
      this.loadPrevSong();
    });
    eventBus.$on('play', payload => {
      this.loadSong(this.$store.state.playlist.nowPlaying);
    });
  },
  methods: {
    onAudioLoadStart() {
      this.$store.commit('setAudioIsLoading', true);
    },
    onAudioCanPlay() {
      this.$store.commit('setAudioIsLoading', false);
      eventBus.$emit('song-can-play');
    },
    onAudioPlay() {
      this.$store.commit('setAudioIsPlaying', true);
    },
    onAudioPause() {
      this.$store.commit('setAudioIsPlaying', false)
    },
    onAudioEnded() {
      if (playlistUtils.hasNextSong(this.$store.state.playlist)) {
        this.loadNextSong();
      } else {
        eventBus.$emit('playlist-ended');
      }
    },
    onAudioTimeUpdate() {
      this.$store.commit('setAudioCurrentTime', this.audioDOMElement.currentTime);
    },
    onAudioLoadedMetadata() {
      this.$store.commit('setAudioProperties', this.getMetadata());
    },
    loadNextSong() {
      if (playlistUtils.hasNextSong(this.$store.state.playlist)) {
        let song = playlistUtils.getNextSong(this.$store.state.playlist);
        this.$store.commit('setNowPlayingSong', song);
        this.loadSong(song);
      }
    },
    loadPrevSong() {
      if (playlistUtils.hasPrevSong(this.$store.state.playlist)) {
        let song = playlistUtils.getPrevSong(this.$store.state.playlist);
        this.$store.commit('setNowPlayingSong', song);
        this.loadSong(song);
      }
    },
    loadSong(song) {
      this.audioSourceDOMElement.src = api.getSongSrcUrl(song.id);
      this.audioDOMElement.load();
    },
    play() {
      this.audioDOMElement.play();
    },
    pause() {
      this.audioDOMElement.pause();
    },
    getMetadata() {
      return {
        paused: this.audioDOMElement.paused,
        volume: this.audioDOMElement.volume,
        currentTime: this.audioDOMElement.currentTime,
        duration: parseInt(this.audioDOMElement.duration, 10)
      };
    },
    /**
     * @deprecated
     */
    loadPlaylist(songs, startSongIdx, shuffle) {
      this.$store.commit('setPlaylist', {
        playlistId: songs[startSongIdx].album.id, shuffle: shuffle, songs: songs, startSongIdx: startSongIdx
      });
      this.loadAudio();
    },
    /**
     * @deprecated
     */
    loadAudio() {
      let currentSong = this.$store.state.playlist.currentSong;
      this.audioSourceDOMElement.src = api.getSongSrcUrl(currentSong.id);
      this.audioDOMElement.load();
      eventBus.$emit('song-is-ready-to-play');
    }
  }
}
</script>