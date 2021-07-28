<template>
  <v-row>

    <v-col align-self="center" md="auto">
      <v-btn small outlined icon @click="goBack">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <span class="px-2"/>

      <v-btn small outlined icon @click="goForward">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>

    </v-col>

    <v-col class="text-left" align-self="center">

      <v-text-field v-show="searchIn" color="grey darken-2" single-line hide-details dense filled rounded clearable :placeholder="'Find in ' + searchIn"
                    v-model="searchInput"
                    @keydown.enter="search" @keydown.esc="clearSearchInput()"
                    @click:clear="clearSearchInput()"
                    @click:prepend-inner="search()">
      </v-text-field>
    </v-col>
  </v-row>

</template>

<script>

import {eventBus} from "@/main";

export default {
  name: "NavToolbarComponent",
  props: [], // artists | albums | songs
  data() {
    return {
      searchInput: null
    }
  },
  mounted() {
  },
  computed: {
    searchIn: function () {
      if (this.$route.name === 'ArtistsComponent') {
        return 'artists'
      } else if (this.$route.name === 'AlbumsComponent' || this.$route.name === 'ArtistComponent') {
        return 'albums';
      } else if (this.$route.name === 'AlbumComponent') {
        return 'songs';
      } else if (this.$route.name === 'GenresComponent') {
        return 'genres';
      } else {
        return null;
      }
    }
  },
  methods: {
    search() {
      eventBus.$emit('search-in-' + this.searchIn, this.searchInput);
    },
    clearSearchInput() {
      this.searchInput = null;
      this.search();
    },
    goBack() {
      this.$router.back();
    },
    goForward() {
      this.$router.forward();
    }

  }
}
</script>

<style scoped>

</style>