<template>

  <div>

    <v-row>
      <v-col class="py-0 pl-0 text-left">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-content class="display-1">Genres</v-list-item-content>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="py-0">

        <v-list align="left" class="py-0">
          <div v-for="(genre, i) in genres">
            <v-list-item  @click="openGenreAlbums(genre)">
              <v-list-item-content>{{genre}}</v-list-item-content>
              <v-list-item-action>
                <v-icon right>mdi-chevron-right</v-icon>
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

import api from "@/http/playqdAPI"

export default {
  name: 'GenresView',
  data() {
    return {
      genres: null
    }
  },
  mounted() {
    api.getGenres().then(response => {
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