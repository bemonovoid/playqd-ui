<template>
  <div class="mb-15 pb-10">

    <v-row class="pt-5">
      <v-subheader class="text-body-2">
        <span>Total: {{genres.length}}</span>
      </v-subheader>
    </v-row>

    <v-row>
      <v-col v-for="genre in genres" :key="genre" :cols="6" align-self="center" md="auto">
        <v-chip outlined small link :to="{name: 'AlbumsComponent', query: {genre: genre}}">{{ genre }}</v-chip>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import api from "@/http/playqdAPI";

export default {
  name: "GenresComponent",
  data() {
    return {
      genres: []
    }
  },
  mounted() {
    api.getGenres({page: 1, pageSize: 1000}, {by: 'NAME', direction: 'ASC'}).then(response => {
      this.genres = response.data.genres;
    })
  },
  methods: {

  }
}
</script>

<style scoped>

</style>