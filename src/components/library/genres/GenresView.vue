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

          <v-item-group align="left" class="py-0">
            <v-text-field flat dense clearable placeholder="Find in genres"
                          @keydown.enter="findGenreByName()" @keydown.esc="clearInput()"
                          v-model="genreNameQuery"
                          @click:clear="clearInput()"
                          prepend-inner-icon="mdi-text-short"
                          append-outer-icon="mdi-magnify"
                          @click:append-outer="findGenreByName()">
            </v-text-field>
          </v-item-group>

          <div v-for="(genre, i) in genres">
            <v-list-item  @click="showAlbumsByGenre(genre)" class="px-0">
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

    <v-row>
      <v-col>
        <v-pagination v-model="pagination.page"
                      @next="nextPage"
                      @previous="prevPage"
                      @input="selectPage"
                      :total-visible="5"
                      :length="pagination.totalPages">
        </v-pagination>
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
      genreNameQuery: null,
      genres: null,
      pagination: {
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0
      },
      defaultPageRequest: {page: 1},
    }
  },
  mounted() {
    this.findGenres(this.defaultPageRequest);
  },
  methods: {
    findGenres(pageRequest) {
      api.getGenres(pageRequest).then(response => {
        this.genres = response.data.genres;
        this.pagination = { page: response.data.page + 1, pageSize: response.data.pageSize, totalElements: response.data.totalElements, totalPages: response.data.totalPages };
      })
    },
    findGenreByName() {
      if (this.genreNameQuery && this.genreNameQuery.length > 0) {
        this.findGenres({ page: 1, name: this.genreNameQuery });
      }
    },
    clearInput() {
      this.genreNameQuery = null;
      this.findGenres(this.defaultPageRequest);
    },
    nextPage() {
      this.findGenres({ page: this.pagination.page});
    },
    prevPage() {
      this.findGenres({ page: this.pagination.page });
    },
    selectPage(page) {
      this.findGenres({ page: page });
    },
    showAlbumsByGenre(genre) {
      this.$router.push({name: 'AlbumsView', query: {genre: genre}});
    },
  }
}

</script>