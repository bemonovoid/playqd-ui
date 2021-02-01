<template>

  <!--  <transition ...>-->
  <!--    <div v-show="isReady">-->
  <!--      <Slider...>-->
  <!--    </div>-->
  <!--  </transition>-->

  <v-app-bar v-if="this.$store.state.playlist.currentSong" fixed bottom flat color="grey lighten-3">

    <div class="py-2 pr-3">
      <v-img max-height="50px" max-width="50px" v-bind:src="this.$store.state.artwork.ofCurrentSong"></v-img>
    </div>

    <v-toolbar-title class="hidden-md-and-up" @click="openPlayerView()">
      <div class="caption px-2 text-left text-truncate">
        {{this.$store.state.playlist.currentSong.name}}
      </div>
      <div class="caption px-2 text-left text-truncate text--disabled">
        <small>{{ this.$store.state.playlist.currentSong.artist.name}}</small>
      </div>
    </v-toolbar-title>

    <v-toolbar-title class="hidden-sm-and-down text-left px-5" style="width: 90%">

      <div class="px-2">
        <v-btn link plain class="pl-0 pt-2 text-capitalize" @click="openPlayerView()">
          {{ this.$store.state.playlist.currentSong.artist.name + ' - ' + this.$store.state.playlist.currentSong.name }}
        </v-btn>

      </div>

      <div>
        <v-slider dense class="toolbar-player-slider" inverse-label
                  thumb-color="black"
                  track-color="grey"
                  track-fill-color="black"
                  min="0"
                  tick-size="1"
                  step="0.001"
                  messages=" "
                  @change="changeAudioCurrentTime()"
                  v-bind:max="this.$store.state.audio.duration"
                  v-model="slider.audioTime = $store.state.audio.currentTime">

          <template v-slot:label>
            <div class="caption text--secondary">
              {{convertSecondsToMinutesAndSeconds($store.state.audio.currentTimeAsInt) + ' / ' + convertSecondsToMinutesAndSeconds($store.state.audio.duration)}}
            </div>
          </template>

          <template v-slot:message>
            <div class="pl-2 pt-0 pb-2">
              {{$store.state.playlist.currentSong.fileExtension}} | {{$store.state.playlist.currentSong.audioBitRate}} kbps | {{$store.state.playlist.currentSong.audioSampleRate}} Hz
            </div>
          </template>

        </v-slider>
      </div>

    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items align="right" class="pl-5">

      <v-btn icon small @click="playPrev()" class="hidden-sm-and-down px-5">
        <v-icon>mdi-rewind</v-icon>
      </v-btn>

      <v-btn class="px-5" v-if="this.$store.state.audio.isPlaying" icon @click="pause()">
        <v-icon x-large>mdi-pause</v-icon>
      </v-btn>

      <v-btn v-else icon @click="resumePlay()" class="px-5">
        <v-icon x-large>mdi-play</v-icon>
      </v-btn>

      <v-btn icon small @click="playNext()" class="px-5">
        <v-icon>mdi-fast-forward</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn icon x-small class="hidden-sm-and-down px-5">
        <v-icon v-bind:color="$store.state.playlist.shuffle ? 'red' : 'grey darken-1'">mdi-shuffle-variant</v-icon>
      </v-btn>

      <v-btn icon x-small class="hidden-sm-and-down">
        <v-icon>mdi-repeat</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <v-menu top :close-on-content-click="false" :offset-y="true">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" class="hidden-sm-and-down">
            <v-icon v-bind:color="volumeIcon.color">{{volumeIcon.name}}</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-slider vertical min="0.0" max="1.0" step="0.01"
                        @change="changeAudioCurrentVolume()"
                        v-model="slider.audioVolume = $store.state.audio.volume">

                <template v-slot:prepend>
                  <v-icon @click="mute()">mdi-volume-mute</v-icon>
                </template>

                <template v-slot:append>
                  <v-icon>mdi-volume-high</v-icon>
                </template>

              </v-slider>
            </v-list-item-content>
          </v-list-item>
        </v-list>

      </v-menu>

      <v-btn icon class="hidden-sm-and-down">
        <v-icon>mdi-heart</v-icon>
      </v-btn>


    </v-toolbar-items>

  </v-app-bar>

</template>

<script>

import {eventBus} from "@/main";

export default {
  name: 'MiniPlayerView',
  components: {},
  data() {
    return {
      volumeIcon: {
        color: 'grey darken-1',
        name: 'mdi-volume-high'
      },
      slider: {
        audioTime: 0,
        audioVolume: 0.5
      }
    }
  },
  methods: {
    playNext() {
      eventBus.$emit('play-next-song');
    },
    playPrev() {
      eventBus.$emit('play-prev-song');
    },
    resumePlay() {
      eventBus.$emit('player-resume-play');
    },
    pause() {
      eventBus.$emit('player-pause');
    },
    mute() {
      this.slider.audioVolume = 0.0;
      this.volumeIcon.color = 'red'
      this.volumeIcon.name = 'mdi-volume-off'
      this.changeAudioCurrentVolume();
    },
    convertSecondsToMinutesAndSeconds(seconds) {
      return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
    },
    changeAudioCurrentTime() {
      eventBus.$emit('toolbar-player-current-time-changed', this.slider.audioTime);
    },
    changeAudioCurrentVolume() {
      if (this.slider.audioVolume > 0) {
        this.volumeIcon.color = 'grey darken-1'
        this.volumeIcon.name = 'mdi-volume-high'
      }
      eventBus.$emit('toolbar-player-current-volume-changed', this.slider.audioVolume);
    },
    openPlayerView() {
      this.$router.push({name: 'PlayerView', params: {songId: this.$store.state.playlist.currentSong.id}})
    }
  }
}

</script>

<style>

  .toolbar-player-slider .v-slider--horizontal {
      min-height: 15px;
  }

</style>