<template>

  <div v-if="this.$store.state.playlist.currentSong">

    <v-bottom-navigation app fixed horizontal class="hidden-sm-and-down pl-2" height="60">

      <v-row>

        <v-col md="auto">
          <v-img v-if="showAlbumImage" max-height="50px" max-width="50px" class="mr-1 mt-1 elevation-1"
                 v-bind:src="$store.getters.getResourceBaseUrl + 'image/' + $store.state.playlist.currentSong.album.id + '?target=ALBUM'" @error="imageError"></v-img>
          <v-img v-else max-height="50px" max-width="50px" class="mr-1 mt-1 elevation-1" src="@/assets/default-album-cover.png"></v-img>
        </v-col>

        <v-col class="text-left">
          <v-row>
            <v-col class="pl-5 text-start d-inline-block">
              <a class="text-body-2 red--text" @click="openPlayerView()">{{this.$store.state.playlist.currentSong.artist.name + ' - ' + this.$store.state.playlist.currentSong.name}}</a>
            </v-col>
            <v-col class="text-right text-caption grey--text" md="auto">
              {{$store.state.playlist.currentSong.fileExtension}} | {{$store.state.playlist.currentSong.audioBitRate}} kbps | {{$store.state.playlist.currentSong.audioSampleRate}} Hz
            </v-col>
            <v-col class="pr-5 text-right text-body-2 red--text" md="auto">
              {{ playlistUtils.secondsToHHmmss($store.state.audio.currentTimeAsInt) + ' / ' + playlistUtils.secondsToHHmmss($store.state.audio.duration) }}
            </v-col>
          </v-row>
          <v-slider
                    dense inverse-label
                    hide-details
                    thumb-color="black"
                    track-color="grey"
                    track-fill-color="black"
                    min="0"
                    tick-size="1"
                    step="0.001"
                    @change="changeAudioCurrentTime()"
                    v-bind:max="this.$store.state.audio.duration"
                    v-model="slider.audioTime = $store.state.audio.currentTime">
          </v-slider>
        </v-col>
      </v-row>

      <v-btn icon small @click="playPrev()">
        <v-icon>mdi-rewind</v-icon>
      </v-btn>

      <v-btn v-if="this.$store.state.audio.isPlaying" @click="pause()">
        <v-icon x-large>mdi-pause</v-icon>
      </v-btn>

      <v-btn v-else icon @click="resumePlay()">
        <v-icon x-large>mdi-play</v-icon>
      </v-btn>

      <v-btn small @click="playNext()">
        <v-icon>mdi-fast-forward</v-icon>
      </v-btn>

      <v-btn icon x-small>
        <v-icon v-bind:color="$store.state.playlist.shuffle ? 'red' : 'grey darken-1'">mdi-shuffle-variant</v-icon>
      </v-btn>

      <v-btn icon x-small>
        <v-icon>mdi-repeat</v-icon>
      </v-btn>

      <v-divider vertical/>

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

      <v-btn icon class="hidden-sm-and-down" @click="updateFavoriteStatus()">
        <v-icon v-if="this.$store.state.playlist.currentSong.favorite" color="yellow darken-3">mdi-star</v-icon>
        <v-icon v-else>mdi-star-outline</v-icon>
      </v-btn>

    </v-bottom-navigation>

    <v-app-bar app fixed bottom flat class="pr-5 hidden-md-and-up" height="60" color="grey lighten-3">

      <v-img v-if="showAlbumImage" max-height="50px" max-width="50px" class="mr-1"
             :src="$store.getters.getResourceBaseUrl + 'image/' + $store.state.playlist.currentSong.album.id + '?target=ALBUM'"
             @error="imageError"></v-img>

      <v-img v-else max-height="50px" max-width="50px" class="mr-1" src="@/assets/default-album-cover.png"></v-img>

      <v-list-item class="pl-1 text-left text-truncate" @click="openPlayerView()">
        <v-list-item-content>
          <v-list-item-title>{{this.$store.state.playlist.currentSong.name}}</v-list-item-title>
          <v-list-item-subtitle>{{this.$store.state.playlist.currentSong.artist.name}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-spacer></v-spacer>

      <v-btn icon v-if="this.$store.state.audio.isPlaying" @click="pause()">
        <v-icon x-large>mdi-pause</v-icon>
      </v-btn>

      <v-btn icon v-else @click="resumePlay()">
        <v-icon x-large>mdi-play</v-icon>
      </v-btn>

      <v-btn icon small @click="playNext()">
        <v-icon>mdi-fast-forward</v-icon>
      </v-btn>

    </v-app-bar>

  </div>

  <div v-else></div>

</template>

<script>

import {eventBus} from "@/main";
import api from "@/http/playqdAPI";
import playlistUtils from "@/utils/playlistUtils";

export default {
  name: 'MiniPlayerView',
  data() {
    return {
      playlistUtils: playlistUtils,
      showAlbumImage: true,
      slider: {
        audioTime: 0,
        audioVolume: 0.5
      },
      volumeIcon: {
        color: 'grey darken-1',
        name: 'mdi-volume-high'
      }
    }
  },
  mounted() {
    eventBus.$on('audio-is-playing', () => {
      this.showAlbumImage = true; // Enables album image update
    });
  },
  methods: {
    changeAudioCurrentTime() {
      eventBus.$emit('toolbar-player-current-time-changed', this.slider.audioTime);
    },
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
    changeAudioCurrentVolume() {
      if (this.slider.audioVolume > 0) {
        this.volumeIcon.color = 'grey darken-1'
        this.volumeIcon.name = 'mdi-volume-high'
      }
      eventBus.$emit('toolbar-player-current-volume-changed', this.slider.audioVolume);
    },
    updateFavoriteStatus() {
      api.setSongFavoriteStatus(this.$store.state.playlist.currentSong).then(response => {
        this.$store.commit('setCurrentSongFavoriteStatus');
      });
    },
    openPlayerView() {
      this.$router.push({name: 'PlayerView', params: {
          songId: this.$store.state.playlist.currentSong.id,
          playerSong: this.$store.state.playlist.currentSong
        }
      })
    },
    imageError() {
      this.showAlbumImage = false;
    },
  }
}

</script>