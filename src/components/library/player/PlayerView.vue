<template>

 <div v-if="this.$store.state.playlist.currentSong">

   <v-row>

     <v-col class="pl-0 pt-2 text-left" md="auto">
       <v-btn depressed plain class="text-capitalize text-subtitle-1" v-bind:to="{name: 'SongsView', params: {albumId: this.$store.state.playlist.currentSong.album.id}}">
         <v-icon left>mdi-arrow-left</v-icon>
         <span>{{this.$store.state.playlist.currentSong.album.name}}</span>
       </v-btn>
     </v-col>

   </v-row>

   <v-row>

     <v-col>

       <v-card align="center" elevation="0">

         <v-img max-width="200px" max-height="200px" contain class="elevation-5" v-bind:src="this.$store.state.artwork.ofCurrentSong"></v-img>

         <v-card-title class="text-body-1" style="display: inherit">{{ this.$store.state.playlist.currentSong.name }}</v-card-title>

         <v-card-subtitle class="py-0">{{ this.$store.state.playlist.currentSong.artist.name }}</v-card-subtitle>

         <v-card-text class="px-2">
           <v-row class="no-gutters">

             <v-col cols="12" class="px-0 no-gutters">
               <v-slider dense inverse-label
                         hint=" "
                         persistent-hint
                         thumb-color="black"
                         track-color="grey"
                         track-fill-color="black"
                         min="0"
                         tick-size="1"
                         step="0.001"
                         @change="changeAudioCurrentTime()"
                         v-bind:max="this.$store.state.audio.duration"
                         v-model="slider.audioTime = $store.state.audio.currentTime">

                 <template v-slot:message>
                    <v-row class="no-gutters">
                      <v-col cols="6" class="pt-0 px-0 text-left">
                        <p>{{convertSecondsToMinutesAndSeconds($store.state.audio.currentTimeAsInt)}}</p>
                      </v-col>
                      <v-col cols="6" class="pt-0 px-0 text-right">
                        {{convertSecondsToMinutesAndSeconds($store.state.audio.duration)}}
                      </v-col>
                    </v-row>
                 </template>

               </v-slider>
             </v-col>

           </v-row>

         </v-card-text>

         <v-card-actions style="display: inherit">

           <v-row>
             <v-col>
               <v-btn fab large elevation="3" @click="playPrev()">
                 <v-icon large>mdi-skip-backward-outline</v-icon>
               </v-btn>
             </v-col>

             <v-col>
               <v-btn class="text-center" v-if="this.$store.state.audio.isPlaying" fab large @click="pause()">
                 <v-icon large>mdi-pause</v-icon >
               </v-btn>
               <v-btn v-else fab large @click="resumePlay">
                 <v-icon class="pl-1" large>mdi-play-outline</v-icon>
               </v-btn>
             </v-col>

             <v-col>
               <v-btn fab large elevation="3" @click="playNext">
                 <v-icon large>mdi-fast-forward-outline</v-icon>
               </v-btn>
             </v-col>

           </v-row>

         </v-card-actions>

         <v-divider/>

         <v-row>
           <v-col class="text-left">
             <v-btn small icon @click="setRepeat()">
               <v-icon v-bind:color="repeatIcon.color">{{repeatIcon.name}}</v-icon>
             </v-btn>
           </v-col>
         </v-row>

         <v-row>
           <v-col class="text-left" md="auto">
             <small>Format: {{$store.state.playlist.currentSong.fileExtension}}</small>
           </v-col>
           <v-col class="text-left" md="auto">
             <small>Bitrate: {{$store.state.playlist.currentSong.audioBitRate}} kbps</small>
           </v-col>
           <v-col class="text-left" md="auto">
             <small>Sample rate: {{$store.state.playlist.currentSong.audioSampleRate}} Hz</small>
           </v-col>
         </v-row>

       </v-card>

     </v-col>

   </v-row>

 </div>

</template>

<script>

import {eventBus} from "@/main";
import {HTTP_CLIENT} from "@/http/axios-config";

export default {
  name: 'PlayerView',
  data() {
    return {
      slider: {
        audioTime: 0,
        audioVolume: 0.5
      },
      repeatIcon: {
        name: 'mdi-repeat',
        color: ''
      }
    }
  },
  mounted() {
    this.$store.commit('setShowMiniPlayer', false);
    if (!this.$store.state.playlist.currentSong) {
      HTTP_CLIENT.get('/library/songs/' + this.$route.params.songId).then(response => {
        eventBus.$emit('play-song', response.data);
      });
    }
  },
  destroyed() {
    this.$store.commit('setShowMiniPlayer', true);
  },
  methods: {
    changeAudioCurrentTime() {
      eventBus.$emit('toolbar-player-current-time-changed', this.slider.audioTime);
    },
    convertSecondsToMinutesAndSeconds(seconds) {
      return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
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
    setRepeat() {
      if (this.$store.state.playlist.repeat === 'none') {
        this.$store.commit('setRepeatMode', 'all');
        this.repeatIcon = {name: 'mdi-repeat', color: 'red'}
      } else if (this.$store.state.playlist.repeat === 'all') {
        this.$store.commit('setRepeatMode', 'once');
        this.repeatIcon = {name: 'mdi-repeat-once', color: 'red'}
      } else {
        this.$store.commit('setRepeatMode', 'none');
        this.repeatIcon = {name: 'mdi-repeat', color: ''}
      }
    }
  }
}

</script>