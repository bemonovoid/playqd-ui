<template>
  <div>
    <audio id="audio-player" autoplay
           v-on:loadedmetadata="onAudioLoadedMetadata()"
           v-on:timeupdate="onAudioTimeUpdate()"
           v-on:ended="onAudioEnded()"
           v-on:play="onAudioPlay()"
           v-on:pause="onAudioPause()">
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
    eventBus.$on('toolbar-player-current-time-changed', (newCurrentTime) => {
      this.$store.commit('setAudioCurrentTime', newCurrentTime);
      this.audioDOMElement.currentTime = newCurrentTime;
    });
    eventBus.$on('toolbar-player-current-volume-changed', (newVolume) => {
      this.$store.commit('setAudioVolume', newVolume);
      this.audioDOMElement.volume = newVolume;
    });
    eventBus.$on('player-pause', () => {
      this.pause();
    });
    eventBus.$on('player-resume-play', () => {
      this.play();
    });
    eventBus.$on('play-next-song', () => {
      this.loadNextSong();
    });
    eventBus.$on('play-prev-song', () => {
      this.loadPrevSong();
    })
    eventBus.$on('play-song', (payload) => {
      this.loadSingleSong(payload);
    })
    eventBus.$on('play-album', payload => {
      this.loadAlbum(payload.songs, payload.startSong, false);
    });
    eventBus.$on('play-album-shuffled', payload => {
      this.loadAlbum(payload.songs, null, true);
    });
  },
  methods: {
    onAudioPlay() {
      this.$store.commit('setAudioIsPlaying', true)
    },
    onAudioPause() {
      this.$store.commit('setAudioIsPlaying', false)
    },
    onAudioEnded() {
      eventBus.$emit('playback-song-ended', this.$store.state.playlist.currentSong.id);
      if (this.$store.getters.hasNextSong) {
        this.$store.commit('setCurrentSongToNext')
        this.loadAudio();
      }
    },
    onAudioTimeUpdate() {
      this.$store.commit('setAudioCurrentTime', this.audioDOMElement.currentTime);
    },
    onAudioLoadedMetadata() {
      this.$store.commit('setAudioProperties', this.getMetadata());
    },
    loadAlbum(songs, startSong, shuffle) {
      let albumId = shuffle ? songs[0].album.id : startSong.album.id;
      this.$store.commit('setPlaylist', {
        playlistId: albumId, shuffle: shuffle, songs: songs, startSong: startSong
      });
      this.loadAudio();
    },
    loadSingleSong(song) {
      this.$store.commit('setCurrentSong', song);
      this.loadAudio();
    },
    loadNextSong() {
      if (this.$store.getters.hasNextSong) {
        this.$store.commit('setCurrentSongToNext')
        this.loadAudio();
      }
    },
    loadPrevSong() {
      if (this.$store.getters.hasPrevSong) {
        this.$store.commit('setCurrentSongToPrev')
        this.loadAudio();
      }
    },
    loadAudio() {
      let currentSong = this.$store.state.playlist.currentSong;
      this.audioSourceDOMElement.src = HTTP_CLIENT.defaults.baseURL + "/audio/open/?songId=" + currentSong.id;
      this.audioDOMElement.load();
      eventBus.$emit('song-is-ready-to-play');
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
    }
  }
}
</script>