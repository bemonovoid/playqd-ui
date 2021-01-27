<template v-if="album">

  <v-dialog v-model="active" persistent max-width="500px">

    <template v-slot:activator="{ on, attrs }">
      <v-btn icon fab v-bind="attrs" v-on="on">
        <v-icon>mdi-square-edit-outline</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="headline">Edit album</span>
      </v-card-title>
      <v-card-text>

        <p class="text-left text-h6">Artist</p>

        <v-row>
          <v-col cols="4">
            <v-text-field dense label="Name" required v-model="album.artist.name" @change="artistUpdated"></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field dense label="Country code" required v-model="album.artist.country" @change="artistUpdated"></v-text-field>
          </v-col>
        </v-row>

        <p class="text-left text-h6">Album</p>

        <v-row>
          <v-col cols="4">
            <v-text-field dense label="Name" required v-model="album.name"></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field type="number" dense label="Year" v-model="album.year"></v-text-field>
          </v-col>
        </v-row>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="active = false">
          Close
        </v-btn>
        <v-btn
            color="blue darken-1"
            text
            @click="active = false">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>

import {HTTP_CLIENT} from "@/http/axios-config";

export default {
  name: 'SongsViewEditAlbum',
  props: ['albumId'],
  data() {
    return {
      title: 'asdsadas',
      active: false,
      album: {id: '', name: '', genre: '', year: '', totalTime: '', artist: {id: '', name: '', country: ''}, artworkSrc: ''},
    }
  },
  created() {
      HTTP_CLIENT.get('/library/albums/' + this.albumId).then((response) => {
          this.album = response.data;
      });
  },
  methods: {
    artistUpdated(any) {

    }
  }
}

</script>