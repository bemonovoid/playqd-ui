<template>

 <div v-if="this.$store.state.playlist.currentSong">

   <v-row>

     <v-col>

       <v-card align="center" elevation="0" height="100%">
          <router-link :to="{name: 'AlbumSongsView', params: {albumId: this.$store.state.playlist.currentSong.album.id}}">
            <v-img v-if="showAlbumImage" max-width="500px" max-height="500px" contain class="elevation-5"
                   :src="$store.getters.getResourceBaseUrl + 'image/' + $store.state.playlist.currentSong.album.id + '?target=ALBUM'" @error="imageError">
            </v-img>
            <v-img v-else class="elevation-5" src="@/assets/default-album-cover.png" max-width="200px" max-height="200px"></v-img>
          </router-link>
         <v-card-title class="pt-2 text-h5" style="display: inherit">
           <v-row>
             <v-col @click="replaceSongNameWithFileName = !replaceSongNameWithFileName" class="text-left">
               {{ this.replaceSongNameWithFileName ? this.$store.state.playlist.currentSong.fileName : this.$store.state.playlist.currentSong.name }}
             </v-col>
             <v-col cols="1" class="text-right">
               <EditSongView v-bind:song-data="this.$store.state.playlist.currentSong"></EditSongView>
             </v-col>
           </v-row>
         </v-card-title>

         <v-card-subtitle class="pt-0 pb-1">
           <v-btn class="text-capitalize text-body-1 green--text" plain height="0" :to="{name: 'AlbumsView', query: {artistId: this.$store.state.playlist.currentSong.artist.id}}">
             {{ this.$store.state.playlist.currentSong.artist.name }}
           </v-btn>
           <v-row>
             <v-col class="pt-3 pb-0 text-left">
               <small>Played: {{$store.state.playlist.currentSong.playCount}}</small>
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
                      <v-col cols="6" class="py-0 px-1 green--text text-left">
                        {{ playlistUtils.secondsToHHmmss($store.state.audio.currentTimeAsInt) }}
                      </v-col>
                      <v-col cols="6" class="py-0 px-1 green--text text-right">
                        -
                        {{ playlistUtils.secondsToHHmmss($store.state.audio.duration - $store.state.audio.currentTimeAsInt) }}
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
               <v-btn x-small fab elevation="3" class="mr-10" @click="setRepeat()">
                 <v-icon v-bind:color="repeatIcon.color">{{repeatIcon.name}}</v-icon>
               </v-btn>

               <v-btn small fab elevation="3" :disabled="!this.$store.getters.hasPrevSong" @click="playPrev()">
                 <v-icon color="success" large>mdi-skip-backward-outline</v-icon>
               </v-btn>

               <v-btn class="mx-5" v-if="this.$store.state.audio.isPlaying" fab @click="pause()">
                 <v-icon color="success" large>mdi-pause</v-icon >
               </v-btn>
               <v-btn class="mx-5" v-else fab @click="resumePlay">
                 <v-icon color="success" large class="pl-1">mdi-play-outline</v-icon>
               </v-btn>

               <v-btn fab small elevation="3" :disabled="!playlistUtils.hasNextSong(null)" @click="playNext">
                 <v-icon color="success" large>mdi-fast-forward-outline</v-icon>
               </v-btn>

               <v-btn x-small fab elevation="3" class="ml-10" @click="fastForward()">
                 <v-icon color="success">mdi-fast-forward-10</v-icon>
               </v-btn>
             </v-col>

           </v-row>

         </v-card-actions>

         <v-row class="pt-5">
           <v-col class="ml-2 pb-2 text-left text-caption text-truncate">
             <small><i>Just played: </i></small>
             <p v-if="this.$store.getters.getPrevSong" class="grey--text">{{playlistUtils.getPrevSong(null)}}</p>
             <p v-else class="grey--text"> - - - </p>
           </v-col>
           <v-col>
             <v-icon v-if="this.$store.state.playlist.currentSong.favorite" color="yellow darken-3" @click="updateFavoriteStatus()">mdi-star</v-icon>
             <v-icon v-else @click="updateFavoriteStatus()">mdi-star-outline</v-icon>
           </v-col>
           <v-col class="mr-2 pb-2 text-right text-caption">
             <small><i>Playing next: </i></small>
             <p v-if="this.$store.getters.hasNextSong" class="grey--text">{{this.$store.state.playlist.nowPlaying.name}}</p>
             <p v-else class="grey--text"> - - - </p>
           </v-col>
         </v-row>

         <v-divider/>

       </v-card>

     </v-col>

   </v-row>

 </div>

</template>

<script>

import {eventBus} from "@/main";
import api from "@/http/playqdAPI"
import playlistUtils from "@/utils/playlistUtils";
import EditSongView from "@/components/library/player/EditSongView";

export default {
  name: 'PlayerView',
  components: { EditSongView },
  props: ['playerSong'],
  data() {
    return {
      playlistUtils: playlistUtils,
      showAlbumImage: true,
      slider: {
        audioTime: 0,
        audioVolume: 0.5
      },
      repeatIcon: {
        name: 'mdi-repeat',
        color: ''
      },
      replaceSongNameWithFileName: false
    }
  },
  mounted() {
    this.$store.commit('setShowMiniPlayer', false);
    if (!this.$store.state.playlist.currentSong && !this.playerSong) {
      api.getSong(this.$route.params.songId).then(response => {
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
        this.repeatIcon = {name: 'mdi-repeat', color: 'yellow'}
      } else if (this.$store.state.playlist.repeat === 'all') {
        this.$store.commit('setRepeatMode', 'once');
        this.repeatIcon = {name: 'mdi-repeat-once', color: 'yellow'}
      } else {
        this.$store.commit('setRepeatMode', 'none');
        this.repeatIcon = {name: 'mdi-repeat', color: ''}
      }
    },
    updateFavoriteStatus() {
      api.setSongFavoriteStatus(this.$store.state.playlist.currentSong).then(response => {
        this.$store.commit('setCurrentSongFavoriteStatus');
      });
    },
    openAlbum() {
      this.$router.push({name: 'AlbumSongsView', params: {albumId: this.$store.state.playlist.currentSong.album.id}})
    },
    imageError() {
      this.showAlbumImage = false;
    }
  }
}
</script>