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
                    <v-icon right>{{sortType.icon}}</v-icon>
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
                <v-img :src="$store.state.artistsBaseUrl + artist.id + '/image'"></v-img>
              </v-list-item-avatar>

              <v-list-item-content class="py-0">
                <v-list-item-title v-text="artist.name"></v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  albums: {{artist.albumCount}}, songs: {{artist.songCount}}
<!--                  played: {{artist.playbackHistory.playCount}}, last: {{artist.playbackHistory.lastTimePlayed.substr(0, 10 )}}, albums: {{artist.albumCount}}-->
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

import PLAYQD_API from "@/http/playqdAPI"

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
      PLAYQD_API.getArtists().then(response => {
        this.$store.commit('setArtists', response.data.artists);
        this.artists = this.$store.getters.getArtists;
        this.totalSongsCount = this.$store.getters.getArtists.map(a => a.songCount).reduce((a1, a2) => a1 + a2, 0);
        this.sortArtists('play-last-date');
      }).catch(error => {
        alert(error.toString())
      });
    } else {
      this.artists = this.$store.getters.getArtists;
      this.totalSongsCount = this.$store.getters.getArtists.map(a => a.songCount).reduce((a1, a2) => a1 + a2, 0);
    }
  },
  methods: {
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
          if (a1.playbackHistory.lastTimePlayed < a2.playbackHistory.lastTimePlayed) return 1;
          if (a1.playbackHistory.lastTimePlayed > a2.playbackHistory.lastTimePlayed) return -1;
          return 0;
        });
      }
      if (sortType === 'play-count') {
        this.artists.sort((a1, a2) => {
          return a2.playbackHistory.playCount - a1.playbackHistory.playCount;
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