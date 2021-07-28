<template>
  <v-app-bar prominent dense dark fixed class="elevation-0" bottom>
    <v-row>

      <v-col class="pl-5 pt-5 text-left" align-self="center">
        <v-row>
          <v-col class="shrink">
            <v-list-item v-if="nowPlayingSong" dense>
              <v-list-item-avatar tile size="70" class="elevation-3">
                <v-img v-if="imageNotFound" src="@/assets/default-album-cover.png"></v-img>
                <v-img v-else :src="$store.getters.getResourceBaseUrl + 'image/' + nowPlayingSong.album.id + '?target=ALBUM'" @error="onImageNotFound"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1">{{nowPlayingSong.name}}</v-list-item-title>
                <v-list-item-subtitle>
                  <v-hover v-slot="{ hover }" open-delay="50">
                    <a style="color: lightgrey" :class="{'text-decoration-underline' : hover}" @click="goToArtist">{{nowPlayingSong.artist.name}}</a>
                  </v-hover>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col v-if="nowPlayingSong" class="text-left" align-self="center">
            <v-btn x-small icon>
              <v-hover v-slot="{ hover }" open-delay="50">
                <v-icon :color="hover ? 'white' : 'grey'">mdi-heart-outline</v-icon>
              </v-hover>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <v-col class="pt-0 pb-5 text-left" align-self="center">
        <v-row class="mt-2 pb-0" align="center">

          <v-col class="text-right">
            <v-btn icon plain x-small elevation="0" @click="setShuffled(playShuffled = !playShuffled)">
              <v-icon v-bind:color="$store.state.playlist.shuffle ? 'red' : 'lightgrey'">mdi-shuffle-variant</v-icon>
            </v-btn>
          </v-col>

          <v-col md="auto">
            <v-btn x-small icon plain elevation="0" :disabled="!playlistUtils.hasPrevSong($store.state.playlist)" @click="playPrevious">
              <v-icon color="lightgrey">mdi-rewind</v-icon>
            </v-btn>
          </v-col>

          <v-col md="auto">
            <v-btn v-if="this.$store.state.audio.isPlaying" fab small color="white" elevation="0" @click="pause">
            <v-icon color="black">mdi-pause</v-icon>
          </v-btn>
            <v-btn v-else fab small color="white" elevation="0" @click="resumePlay">
              <v-icon color="black">mdi-play</v-icon>
            </v-btn>
          </v-col>

          <v-col md="auto">
            <v-btn x-small plain icon elevation="0" :disabled="!playlistUtils.hasNextSong(this.$store.state.playlist)" @click="playNext">
              <v-icon color="lightgrey">mdi-fast-forward</v-icon>
            </v-btn>
          </v-col>

          <v-col>
            <v-btn plain icon x-small elevation="0" @click="setRepeat">
            <v-icon :color="playRepeated.color">{{playRepeated.icon}}</v-icon>
          </v-btn>
          </v-col>

        </v-row>

        <v-row class="mt-0">

          <v-col class="my-0 py-0">
            <v-slider dense hide-details
                loader-height="0"
                thumb-color="white"
                track-color="grey"
                track-fill-color="red"
                min="0"
                tick-size="1"
                step="0.001"
                @change="changeTime()"
                :max="this.$store.state.audio.duration"
                v-model="slider.audioTime = $store.state.audio.currentTime">

              <template v-slot:prepend>
                <span class="text-caption grey--text">{{playlistUtils.secondsToHHmmss($store.state.audio.currentTimeAsInt)}}</span>
              </template>

              <template v-slot:append>
                <span class="text-caption grey--text">{{playlistUtils.secondsToHHmmss($store.state.audio.duration)}}</span>
              </template>

            </v-slider>
          </v-col>
        </v-row>
      </v-col>

      <v-col align-self="center">
        <v-row>
          <v-spacer/>
          <v-spacer/>
          <v-col class="text-right">

          </v-col>
          <v-col>
            <v-slider dense hide-details
                      color="red"
                      loader-height="0"
                      min="0.0"
                      max="1.0"
                      step="0.01"
                      @change="applyNewVolume(slider.audioVolume)"
                      v-model="slider.audioVolume">

              <template v-slot:prepend>
                <v-btn x-small icon :to="{name: 'queue'}">
                  <v-icon :color="$route.name === 'queue' ? 'red' : 'grey'">mdi-playlist-music-outline</v-icon>
                </v-btn>
                <span class="px-2"></span>
                <v-btn x-small icon @click="muteUnmute">
                  <v-icon color="grey">{{slider.audioVolumeIcon}}</v-icon>
                </v-btn>
                <v-item-group>
                </v-item-group>

              </template>

            </v-slider>
          </v-col>
        </v-row>

      </v-col>

    </v-row>

  </v-app-bar>
</template>

<script>

import {eventBus} from "@/main";

export default {
  name: "PlayerComponent",
  props: ['playlistUtils'],
  data() {
    return {
      imageNotFound: false,
      playShuffled: false,
      repeat: [
        {type: 'none', icon: 'mdi-repeat',      color: 'lightgrey'},
        {type: 'loop', icon: 'mdi-repeat',      color: 'red'},
        {type: 'once', icon: 'mdi-repeat-once', color: 'red'}
      ],
      playRepeated: {type: 'none', icon: 'mdi-repeat', color: 'lightgrey'},
      slider: {
        audioTime: 0,
        audioVolume: 0.5,
        audioVolumeIcon: 'mdi-volume-medium'
      }
    }
  },
  computed: {
    nowPlayingSong: function () {
      return this.$store.state.playlist.nowPlaying;
    },
  },
  methods: {
    onImageNotFound() {
      this.imageNotFound = true;
    },
    goToArtist() {
      this.$router.push({name: 'ArtistComponent', params: {artistId: this.nowPlayingSong.artist.id}})
    },
    pause() {
      eventBus.$emit('pause');
    },
    resumePlay() {
      eventBus.$emit('resume-play');
    },
    playNext() {
      eventBus.$emit('play-next');
    },
    playPrevious() {
      eventBus.$emit('play-previous');
    },
    setShuffled(shuffled) {
      this.$store.commit('setShuffle', shuffled);
    },
    setRepeat() {
      if (this.playRepeated.type === this.repeat[0].type) {
        this.playRepeated = this.repeat[1];
      } else if (this.playRepeated.type === this.repeat[1].type) {
        this.playRepeated = this.repeat[2];
      } else {
        this.playRepeated = this.repeat[0];
      }
      this.$store.commit('setRepeat', this.playRepeated.type);
    },
    changeTime() {
      eventBus.$emit('new-current-time', this.slider.audioTime);
    },
    muteUnmute() {
      if (this.slider.audioVolumeIcon !== 'mdi-volume-mute') {
        this.slider.audioVolumeIcon = 'mdi-volume-mute'
        this.applyNewVolume(0);
      } else {
        this.slider.audioVolumeIcon = 'mdi-volume-medium'
        this.applyNewVolume(this.slider.audioVolume);
      }
    },
    applyNewVolume(volume) {
      eventBus.$emit('volume-changed', volume);
    },
  }
}
</script>

<style scoped>

</style>