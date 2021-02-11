<template>

 <div v-if="this.$store.state.playlist.currentSong">

   <v-row>

     <v-col>

       <v-card align="center" elevation="0">
          <router-link :to="{name: 'AlbumSongsView', params: {albumId: this.$store.state.playlist.currentSong.album.id}}">
            <v-img max-width="200px" max-height="200px" contain class="elevation-5"
                   v-bind:src="this.$store.state.artwork.ofCurrentSong">
            </v-img>
          </router-link>
         <v-card-title class="pt-2 text-h5" style="display: inherit">{{ this.$store.state.playlist.currentSong.name }}</v-card-title>

         <v-card-subtitle class="pt-0 pb-1">
           <v-btn class="text-capitalize text-body-1" plain height="0" :to="{name: 'AlbumsView', query: {artistId: this.$store.state.playlist.currentSong.artist.id}}">
             {{ this.$store.state.playlist.currentSong.artist.name }}
           </v-btn>
           <v-row>
             <v-col class="pt-3 pb-0 text-left">
               <small>Played: {{$store.state.playlist.currentSong.playbackHistory.playCount}}</small>
             </v-col>
             <v-col class="text-right">
               <small>{{$store.state.playlist.currentSong.fileExtension}} | {{$store.state.playlist.currentSong.audioBitRate}} kbps | {{$store.state.playlist.currentSong.audioSampleRate}} Hz</small>
             </v-col>
           </v-row>
         </v-card-subtitle>

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
                      <v-col cols="6" class="py-0 px-1 red--text text-left">
                        {{SONG_DURATION.convertSecondsToMinutesAndSeconds($store.state.audio.currentTimeAsInt)}}
                      </v-col>
                      <v-col cols="6" class="py-0 px-1 red--text text-right">
                        - {{SONG_DURATION.convertSecondsToMinutesAndSeconds($store.state.audio.duration - $store.state.audio.currentTimeAsInt)}}
<!--                        {{ SONG_DURATION.convertSecondsToMinutesAndSeconds($store.state.audio.duration) }}-->
                      </v-col>
                    </v-row>
                 </template>

               </v-slider>
             </v-col>

           </v-row>

         </v-card-text>

         <v-card-actions class="pt-0" style="display: inherit">

           <v-row>
             <v-col class="pt-0">
               <v-btn x-small fab elevation="3" class="mr-10" @click="rewind()">
                 <v-icon>mdi-rewind-10</v-icon>
               </v-btn>

               <v-btn small fab elevation="3" :disabled="!this.$store.getters.hasPrevSong" @click="playPrev()">
                 <v-icon large>mdi-skip-backward-outline</v-icon>
               </v-btn>

               <v-btn class="mx-5" v-if="this.$store.state.audio.isPlaying" fab @click="pause()">
                 <v-icon large>mdi-pause</v-icon >
               </v-btn>
               <v-btn class="mx-5" v-else fab @click="resumePlay">
                 <v-icon large class="pl-1">mdi-play-outline</v-icon>
               </v-btn>

               <v-btn fab small elevation="3" :disabled="!this.$store.getters.hasNextSong" @click="playNext">
                 <v-icon large>mdi-fast-forward-outline</v-icon>
               </v-btn>

               <v-btn x-small fab elevation="3" class="ml-10" @click="fastForward()">
                 <v-icon>mdi-fast-forward-10</v-icon>
               </v-btn>
             </v-col>

           </v-row>

         </v-card-actions>

         <v-row>
           <v-col class="pb-0 text-left text-caption text-truncate">
             <div v-if="this.$store.getters.getPrevSong">
               <small>Just played: </small>
               <p class="grey--text">{{this.$store.getters.getPrevSong.name}}</p>
             </div>
           </v-col>
           <v-col class="pb-0 text-right text-caption">
             <div v-if="this.$store.getters.getNextSong">
               <small>Playing next: </small>
               <p class="grey--text">{{this.$store.getters.getNextSong.name}}</p>
             </div>
           </v-col>
         </v-row>

         <v-divider/>

         <v-row class="px-3">
           <v-col class="pt-5 text-left">
             <v-btn small icon elevation="1" @click="setRepeat()">
               <v-icon v-bind:color="repeatIcon.color">{{repeatIcon.name}}</v-icon>
             </v-btn>
             <v-btn small icon elevation="1" class="mx-5">
               <v-icon>mdi-shuffle-variant</v-icon>
             </v-btn>
           </v-col>
           <v-col class="pt-5 text-right">
             <v-btn small icon elevation="1" @click="updateFavoriteStatus()">
               <v-icon v-if="this.$store.state.playlist.currentSong.favorite" color="yellow darken-3">mdi-star</v-icon>
               <v-icon v-else>mdi-star-outline</v-icon>
             </v-btn>
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
import {SONG_HELPER} from "@/utils/songs-helper";

export default {
  name: 'PlayerView',
  props: ['playerSong'],
  data() {
    return {
      SONG_DURATION: SONG_HELPER,
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
    if (!this.playerSong) {
      HTTP_CLIENT.get('/library/songs/' + this.$route.params.songId).then(response => {
        let songs = [response.data];
        eventBus.$emit('play-playlist', {songs: songs, startSongIdx: 0, shuffle: false});
      });
    }
  },
  destroyed() {
    this.$store.commit('setShowMiniPlayer', true);
  },
  methods: {
    changeAudioCurrentTime(newAudioTime) {
      eventBus.$emit('toolbar-player-current-time-changed', newAudioTime ? newAudioTime : this.slider.audioTime);
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
    rewind() {
      this.changeAudioCurrentTime(this.slider.audioTime - 10);
    },
    fastForward() {
      this.changeAudioCurrentTime(this.slider.audioTime + 10);
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
    },
    updateFavoriteStatus() {
      HTTP_CLIENT.post('/library/songs/' + this.$store.state.playlist.currentSong.id).then(response => {
        this.$store.commit('setCurrentSongFavoriteStatus');
      });
    },
    openAlbum() {
      this.$router.push({name: 'AlbumSongsView', params: {albumId: this.$store.state.playlist.currentSong.album.id}})
    }
  }
}

</script>