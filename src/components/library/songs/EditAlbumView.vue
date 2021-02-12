<template>

  <v-dialog v-model="active" persistent max-width="500px">

    <template v-slot:activator="{ on, attrs }">
      <v-btn small fab icon v-bind="attrs" v-on="on">
        <v-icon small>mdi-file-document-edit-outline</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="headline">Edit Album</span>
      </v-card-title>
      <v-card-text>

        <v-form v-model="editForm.valid">
          <v-text-field dense label="Name"
                        persistent-hint
                        :hint="albumData.name"
                        v-model="album.name">
          </v-text-field>

          <v-text-field dense label="Genre" class="pt-5"
                        persistent-hint
                        :hint="albumData.genre"
                        v-model="album.genre">
          </v-text-field>

          <v-text-field dense label="Year" class="pt-5"
                        persistent-hint
                        :hint="albumData.date"
                        v-model="album.date">
          </v-text-field>

          <v-text-field dense label="Artwork src" class="pt-5"
                        persistent-hint
                        hint="URL"
                        v-model="album.artworkSrc">
          </v-text-field>

          <v-checkbox label="Override song name with file name" color="red" v-model="album.overrideSongNameWithFileName"></v-checkbox>
        </v-form>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="active = false">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="saveChanges()">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>

import {HTTP_CLIENT} from "@/http/axios-config";

export default {
  name: 'EditAlbumView',
  props: ['albumData'],
  data() {
    return {
      active: false,
      editForm: {
        valid: false
      },
      album: {
        name: this.albumData.name,
        genre: this.albumData.genre,
        date: this.albumData.date,
        overrideSongNameWithFileName: false,
        artworkSrc: ''
      },
    }
  },
  methods: {
    saveChanges() {
      if (this.editForm.valid) {
        console.log(this.album)
        HTTP_CLIENT.put('/library/albums/' + this.albumData.id, this.album).then(response => {
            this.active = false;
        });
      }
    }
  }
}

</script>