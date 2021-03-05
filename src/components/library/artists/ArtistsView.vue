<template>

  <div>
    <v-row>

      <v-col class="py-0 pl-0 text-left">
        <v-list-item>

          <v-list-item-content>
            <v-list-item-title class="display-1">Artists</v-list-item-title>
            <v-list-item-subtitle class="text-caption text--disabled">
              Total: {{artists.length}}, songs: {{this.totalSongsCount}}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-menu offset-y left>
              <template v-slot:activator="{ attrs, on}">
                <v-btn fab small icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>

              <v-list dense class="text-left">
                <v-subheader>Sort artists</v-subheader>
                <v-list-item v-for="(sortType, i) in sorting.types" :key="i" @click="sortArtists(sortType.id)">
                  <v-list-item-title>{{sortType.name}}</v-list-item-title>
                  <v-list-item-icon>
                    <v-icon right small>{{sortType.icon}}</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="py-0">

        <v-list align="left" class="py-0">

          <v-item-group align="left" class="py-0">
            <v-text-field placeholder="Find in artists"
                          v-model="searchFilter"
                          @input="filterArtists()"
                          clearable
                          @click:clear="clearInput()"
                          prepend-inner-icon="mdi-magnify">
            </v-text-field>
          </v-item-group>

          <v-list-item-group color="primary">

            <v-list-item v-for="(artist, i) in artists" :key="i" class="pl-0" :to="{name: 'AlbumsView', query: {artistId: artist.id}}">

              <v-list-item-avatar class="ml-0 mr-2">
                <v-img :src="$store.getters.getArtistBaseUrl + artist.id + '/image'" alt="alt"></v-img>
              </v-list-item-avatar>

              <v-list-item-content class="py-0">
                <v-list-item-title v-text="artist.name"></v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{albumsCountString(artist) + ', ' + albumSongsCountString(artist)}}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon right>mdi-chevron-right</v-icon>
              </v-list-item-action>

            </v-list-item>

          </v-list-item-group>

        </v-list>

      </v-col>

    </v-row>

  </div>


</template>

<script>

import api from "@/http/playqdAPI"

export default {
  name: 'ArtistsView',
  components: {

  },
  data() {
    return {
      searchFilter: '',
      artists: [],
      totalSongsCount: 0,
      sorting: {
        types: [
          {id: 'name',            name: 'By Name',         icon: 'mdi-sort-alphabetical-ascending'},
          {id: 'play-last-date',  name: 'Recently Played', icon: 'mdi-sort-clock-ascending-outline'},
          {id: 'play-count',      name: 'Most Played',     icon: 'mdi-sort-ascending'},
          {id: 'album-count',     name: 'Total Albums',    icon: 'mdi-folder-music-outline'},
          {id: 'song-count',      name: 'Total Songs',     icon: 'mdi-music-box-multiple-outline'}
        ]
      }
    }
  },
  mounted() {
    if (this.$store.getters.getArtists.length === 0) {
      api.getArtists().then(response => {
        this.$store.commit('setArtists', response.data.artists);
        this.artists = this.$store.getters.getArtists;
        this.totalSongsCount = this.$store.getters.getArtists.map(a => a.songCount).reduce((a1, a2) => a1 + a2, 0);
        this.sortArtists('play-last-date');
      });
    } else {
      this.artists = this.$store.getters.getArtists;
      this.totalSongsCount = this.$store.getters.getArtists.map(a => a.songCount).reduce((a1, a2) => a1 + a2, 0);
    }
  },
  methods: {
    albumsCountString(artist) {
      return artist.albumCount > 1 ? artist.albumCount + ' albums' : artist.albumCount + ' album';
    },
    albumSongsCountString(artist) {
      return artist.songCount > 1 ? artist.songCount + ' songs' : artist.songCount + ' song';
    },
    filterArtists() {
      if (!this.searchFilter || this.searchFilter === '') {
        this.artists = this.$store.getters.getArtists;
      } else {
        let filter = this.searchFilter.toLowerCase();
        this.artists = this.$store.getters.getArtists.filter(artist => artist.name.toLowerCase().includes(filter));
      }
    },
    clearInput() {
      this.searchFilter = '';
      this.filterArtists();
    },
    sortArtists(sortType) {
      if (sortType === 'name') {
        this.artists.sort((a1, a2) => {
          let a1Name = a1.name;
          let a2Name = a2.name;
          return a1Name.localeCompare(a2Name);
        });
      }
      if (sortType === 'play-last-date') {
        this.artists.sort((a1, a2) => {
          if (a1.playbackInfo) {
            if (a2.playbackInfo) {
              if (a1.playbackInfo.lastPlayedTime < a2.playbackInfo.lastPlayedTime) return 1;
              if (a1.playbackInfo.lastPlayedTime > a2.playbackInfo.lastPlayedTime) return -1;
            } else {
              return 1;
            }
          } else if (a2.playbackInfo) {
            return 1;
          } else {
            return -1;
          }
        });
      }
      if (sortType === 'play-count') {
        this.artists.sort((a1, a2) => {
          if (a1.playbackInfo && a2.playbackInfo) {
            return a2.playbackInfo.playCount - a1.playbackInfo.playCount;
          }
          return 0;
        });
      }
      if (sortType === 'album-count') {
        this.artists.sort((a1, a2) => {
          return a2.albumCount - a1.albumCount;
        });
      }
      if (sortType === 'song-count') {
        this.artists.sort((a1, a2) => {
          return a2.songCount - a1.songCount;
        });
      }
    }
  }
}
</script>