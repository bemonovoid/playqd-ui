<template>
  <div v-if="artist">
    <v-row class="pt-10">
      <v-col>
        <v-img class="artist-img white--text align-end" v-if="artist.images"
               :src="artist.images[artist.images.length - 1].url">
          <v-card-title class="text-h1">{{artist.name}}</v-card-title>
        </v-img>
        <v-img v-else contain class="artist-img white--text align-end" src="@/assets/default-album-cover.png" style="background: linear-gradient(#e66465, #9198e5);">
          <v-card-title class="text-h1">{{artist.name}}</v-card-title>
        </v-img>
      </v-col>
    </v-row>

    <v-row>
      <v-col md="auto">
        <v-btn v-if="thisArtistPlaying" large fab color="error" elevation="0" @click="pause">
          <v-icon x-large color="white">mdi-pause</v-icon>
        </v-btn>
        <v-btn v-else large fab color="error" elevation="0" @click="playAll">
          <v-icon x-large color="white">mdi-play</v-icon>
        </v-btn>
      </v-col>
      <v-col class="text-left" align-self="center">
        <v-btn icon large elevation="0">
          <v-icon color="black">mdi-dots-horizontal</v-icon>
        </v-btn>
      </v-col>
      <v-col v-if="thisArtistLoaded" class="text-left" align-self="center">
        <span class="text-caption"><small>Now playing:</small></span>
        <v-list-item dense>
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1 red--text">{{this.$store.state.playlist.nowPlaying.name}}</v-list-item-title>
            <v-list-item-subtitle>
              <v-hover v-slot="{ hover }" open-delay="50">
                <a class="text-caption text--secondary" :class="{'text-decoration-underline' : hover}" @click="openPlayingAlbum">{{$store.state.playlist.nowPlaying.album.name}}</a>
              </v-hover>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col class="text-right pt-0" align-self="center">
        <template v-for="genre in new Set(albums.map(item => item.genre))">
          <v-chip outlined link class="mr-2" small label :to="{name: 'AlbumsComponent', query: {genre: genre}}">{{genre}}</v-chip>
        </template>
      </v-col>

    </v-row>

    <v-row>
      <v-divider/>
    </v-row>

    <v-card-title class="text-h5 pl-1">Albums</v-card-title>

    <v-row class="mb-15 pb-10">
      <v-col v-for="album in albums" :key="album.id" :cols="6" align-self="center" md="auto">
        <v-hover v-slot="{ hover }" open-delay="50">
          <v-card outlined class="album-card" @click="openAlbum(album)" :elevation="hover ? '3' : '0'">

          <div class="pa-2" v-if="albumsWithoutImage.includes(album.id)">
            <v-img contain class="album-card-img" src="@/assets/default-album-cover.png" style="background: linear-gradient(#e66465, #9198e5);"></v-img>
          </div>
          <div class="pa-2" v-else>
            <v-img contain :src="$store.getters.getResourceBaseUrl + 'image/' + album.id + '?target=ALBUM'"
                   @error="imageError(album.id)"
                   class="white--text align-end album-card-img">
            </v-img>
          </div>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-card-subtitle
                  class="py-0 text-left text-truncate text-subtitle-1 white--text"
                  v-bind="attrs" v-on="on"
                  v-text="album.name">
              </v-card-subtitle>
            </template>
            <span>{{ album.name }}</span>
          </v-tooltip>

          <v-card-subtitle class="py-0 text-left text-truncate text-caption text--disabled" v-text="album.date ? album.date : '----'"></v-card-subtitle>

        </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </div>

</template>

<script>
import api from "@/http/playqdAPI";
import {eventBus} from "@/main";

export default {
  name: "ArtistComponent",
  props: ['artistProp'],
  data() {
    return {
      artist: null,
      albums: [],
      showArtistImage: true,
      albumsWithoutImage: [],
      sorting: {
        types: [
          {by: 'NAME', direction: 'ASC',  name: 'Title',        icon: 'mdi-sort-alphabetical-ascending'},
          {by: 'DATE', direction: 'DESC', name: 'Newest First', icon: 'mdi-sort-clock-ascending-outline'},
          {by: 'DATE', direction: 'ASC',  name: 'Oldest First', icon: 'mdi-sort-ascending'}
        ]
      },
      pagination: {
        page: 1,
        pageSize: 1000,
        totalElements: 0,
        totalPages: 0
      }
    }
  },
  computed: {
    thisArtistLoaded: function () {
      return this.artist && this.$store.state.playlist.nowPlaying && this.artist.id === this.$store.state.playlist.nowPlaying.artist.id;
    },
    thisArtistPlaying: function () {
      return this.artist && this.$store.state.playlist.nowPlaying && this.artist.id === this.$store.state.playlist.nowPlaying.artist.id && this.$store.state.audio.isPlaying;
    }
  },
  mounted() {
    this.selectedSortType = this.sorting.types[0];
    this.defaultPageRequest = this.createPageRequest(1, this.sorting.types[0]);
    this.findAlbums();
  },
  methods: {
    findAlbums() {
      api.getAlbums(this.pagination, this.sorting.types[0], this.$route.params.artistId).then(response => {
        this.artist = response.data.albums[0].artist;
        this.albums = response.data.albums;
        this.pagination = { page: response.data.page + 1, pageSize: response.data.pageSize, totalElements: response.data.totalElements, totalPages: response.data.totalPages };
      });
    },
    createPageRequest(page, sortType) {
      return { page: page, pageSize: 6, sort: sortType ? sortType : this.selectedSortType, name: '', artistId: this.$route.params.artistId, genre: this.$route.query.genre };
    },
    imageError(albumId) {
      if (albumId) {
        this.albumsWithoutImage.push(albumId);
      } else {
        this.showArtistImage = false;
      }
    },
    openPlayingAlbum() {
      this.openAlbum(this.$store.state.playlist.nowPlaying.album);
    },
    openAlbum(album) {
      this.$router.push({name: 'AlbumComponent', params: {albumId: album.id}});
    },
    pause() {
      eventBus.$emit('pause');
    },
    playAll() {
      let nowPlayingSong = this.$store.state.playlist.nowPlaying;
      if (nowPlayingSong && nowPlayingSong.artist.id === this.artist.id) {
        eventBus.$emit('resume-play');
      } else {
        api.getArtistSongs(this.artist.id).then(response => {
          this.$store.commit('setPlaylist', {nowPlaying: response.data.songs[0], songs: response.data.songs});
          eventBus.$emit('play');
        });
      }
    }
  }
}
</script>

<style scoped>
  .artist-img {
    max-width: 100%;
    max-height: 450px;
  }
  .album-card {
    width: 200px;
    height: 250px;
  }
  .album-card-img {
    width: 180px;
    height: 180px;
  }
</style>