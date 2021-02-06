<template>

  <div>

    <v-row>
      <v-col class="pl-0 text-left" md="auto">
        <v-btn depressed plain class="text-capitalize text-subtitle-1" v-bind:to="{name: 'LibraryView'}">
          <v-icon left>mdi-arrow-left</v-icon>
          <span>Library</span>
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="py-0">

        <v-list align="left" class="py-0">
          <v-list-item-title class="text-left text--black display-1 pt-1 pb-0 mb-0">Genres</v-list-item-title>

          <div v-for="(genre, i) in genres">
            <v-list-item  @click="openGenreAlbums(genre)">
              <v-list-item-content>{{genre}}</v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider/>
          </div>
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import {HTTP_CLIENT} from "@/http/axios-config";
import {eventBus} from "@/main";

export default {
  name: 'GenresView',
  data() {
    return {
      genres: null
    }
  },
  created() {
    eventBus.$emit('toolbar-back-route-changed', {
      toolBarParams: {title: 'Library', routeParams: {name: 'LibraryView'}}
    });
    HTTP_CLIENT.get('/library/genres/').then(response => {
      this.genres = response.data.genres;
    })
  },
  methods: {
    openGenreAlbums(genre) {
      this.$router.push({name: 'AlbumsView', query: {genre: genre}});
    }
  }
}

</script>