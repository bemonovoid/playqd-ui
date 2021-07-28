<template>
  <div class="mb-15 pb-10">

    <v-row class="pt-5">
      <v-subheader class="text-body-2">
        <span>Total: {{pagination.totalElements}}</span>
      </v-subheader>
    </v-row>

    <v-row >
      <v-col v-for="album in albums" :key="album.id" :cols="6" align-self="center" md="auto">
        <v-hover v-slot="{ hover }" open-delay="50">
          <v-card outlined class="album-card" @click="openAlbum(album)" :elevation="hover ? '3' : '0'">

            <div class="pa-2" v-if="albumsWithoutImage.includes(album.id)">
              <v-img contain class="album-card-img" src="@/assets/default-album-cover.png" style="background: linear-gradient(#e66465, #9198e5);"></v-img>
            </div>
            <div class="pa-2" v-else>
              <v-img :src="$store.getters.getResourceBaseUrl + 'image/' + album.id + '?target=ALBUM'"
                     @error="imageError(album.id)"
                     class="white--text align-end album-card-img">
              </v-img>
            </div>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-card-subtitle
                    class="py-0 text-left text-truncate text-subtitle-1 white--text"
                    v-bind="attrs" v-on="on">
                  {{album.name}}
                </v-card-subtitle>
              </template>
              <span>{{ album.name }}</span>
            </v-tooltip>

            <v-card-subtitle class="py-0 text-left text-truncate text-caption text--disabled" v-text="album.date ? album.date : '----'"></v-card-subtitle>

          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-pagination color="black"
                      v-model="pagination.page"
                      @input="changePage"
                      :total-visible="5"
                      :length="pagination.totalPages">
        </v-pagination>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import api from "@/http/playqdAPI";
import {eventBus} from "@/main";

export default {
  name: "AlbumsComponent",
  data() {
    return {
      dataLoaded: false,
      albumsWithoutImage: [],
      albums: [],
      genre: null,
      pagination: {
        page: 1,
        pageSize: 30,
        totalElements: 0,
        totalPages: 0
      },
      sort: {
        by: "name",
        direction: 'ASC'
      }
    }
  },
  mounted() {
    if (this.$route.query.page) {
      this.pagination.page = parseInt(this.$route.query.page.valueOf());
    }
    if (this.$route.query.genre) {
      this.genre = this.$route.query.genre.valueOf();
    }
    this.findAlbums();
    eventBus.$on('search-in-albums', searchQuery => {
      this.findAlbums(searchQuery);
    });
  },
  methods: {
    findAlbums(name) {
      api.getAlbums(this.pagination, this.sort, null, this.genre, name).then(response => {
        this.albums = response.data.albums;
        this.pagination = {
          page: response.data.page + 1,
          pageSize: response.data.pageSize,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages
        };
        this.dataLoaded = true;
      });
    },
    openAlbum(album) {
      this.$router.push({name: 'AlbumComponent', params: {albumId: album.id, albumProp: album}});
    },
    changePage() {
      this.$router.push({query: {page: this.pagination.page.valueOf()}});
      this.findAlbums();
    },
    imageError(albumId) {
      this.albumsWithoutImage.push(albumId);
    }
  }
}
</script>

<style scoped>
  .album-card {
    width: 200px;
    height: 250px;
  }
  .album-card-img {
    width: 180px;
    height: 180px;
  }
</style>