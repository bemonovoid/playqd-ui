<template>

  <div>


    <v-row>
      <v-col align="left">

        <v-breadcrumbs>
          <v-breadcrumbs-item link href="#/library/artists">
            <v-icon left>mdi-arrow-left</v-icon>
            <span>Artists</span>
          </v-breadcrumbs-item>
        </v-breadcrumbs>

      </v-col>
    </v-row>

    <v-row>
      <v-col>

        <v-list align="left">

          <v-subheader>
            <h1>Albums</h1>
          </v-subheader>

          <v-list-item-group color="primary">

            <v-list-item v-for="(album, i) in artistAlbums.albums" :key="i" @click="onAlbumSelected(album.id)">

              <v-list-item-content>
                <v-list-item-title v-text="album.name"></v-list-item-title>
              </v-list-item-content>

            </v-list-item>

          </v-list-item-group>

        </v-list>

      </v-col>
    </v-row>

  </div>

</template>


<script>

import {HTTP_CLIENT} from "@/http/axios-config"

export default {
  name: 'AlbumsView',
  components: {},
  data() {
    return {
      artistAlbums: {},
      artistName: ''
    }
  },
  methods: {
    onAlbumSelected(albumId) {
      this.$router.push({name: 'SongsView', params: {albumId: albumId}});
    }
  },
  created() {
    let artistId = this.$route.params.artistId;
    HTTP_CLIENT.get('/library/artists/' + artistId + '/albums').then(response => {
      this.artistAlbums = response.data;
      this.artistName = this.artistAlbums.artist.name
    })
  }
}
</script>