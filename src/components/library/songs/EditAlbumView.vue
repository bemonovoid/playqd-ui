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

        <v-form v-model="editForm.valid" class="pt-5">
          <v-text-field dense label="Album Name"
                        persistent-hint
                        :disabled="moveToExistingAlbum"
                        :hint="albumData.name"
                        v-model="album.name">
          </v-text-field>

          <v-text-field dense label="Genre" class="pt-5"
                        persistent-hint
                        :disabled="moveToExistingAlbum"
                        :hint="albumData.genre"
                        v-model="album.genre">
          </v-text-field>

          <v-text-field dense label="Year" class="pt-5"
                        persistent-hint
                        :disabled="moveToExistingAlbum"
                        :hint="albumData.date"
                        v-model="album.date">
          </v-text-field>

          <v-text-field dense label="Artwork url" class="pt-5"
                        persistent-hint
                        :disabled="moveToExistingAlbum"
                        hint="URL"
                        v-model="album.artworkSrc">
          </v-text-field>

          <v-checkbox label="Override song name with file name" color="red"
                      :disabled="moveToExistingAlbum"
                      v-model="album.overrideSongNameWithFileName">
          </v-checkbox>

          <v-row align="center" class="pt-5">
            <v-checkbox hide-details class="mt-0" v-model="moveToExistingAlbum"></v-checkbox>
            <v-autocomplete dense label="Move to existing album" class="pt-5 pr-3 text-left"
                            clearable
                            persistent-hint
                            :disabled="!moveToExistingAlbum"
                            :hint="albumData.name"
                            item-text="name"
                            item-value="id"
                            v-model="album.id"
                            :items="artistAlbums">
            </v-autocomplete>
          </v-row>

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

import {eventBus} from "@/main";
import PLAYQD_API from "@/http/playqdAPI"

export default {
  name: 'EditAlbumView',
  props: ['albumData'],
  data() {
    return {
      active: false,
      moveToExistingAlbum: false,
      editForm: {
        valid: false
      },
      artistAlbums: [],
      album: {
        id: this.albumData.id,
        moveToAlbumId: null,
        name: this.albumData.name,
        genre: this.albumData.genre,
        date: this.albumData.date,
        overrideSongNameWithFileName: false,
        artworkSrc: ''
      },
    }
  },
  mounted() {
    PLAYQD_API.getArtistAlbums(this.albumData.artist.id).then(response => {
      this.artistAlbums = response.data.albums.filter(alb => alb.id !== this.albumData.id);
    });
  },
  methods: {
    saveChanges() {
      if (this.editForm.valid) {
        PLAYQD_API.updateAlbum(this.album).then(response => {
          eventBus.$emit('album-data-updated', this.album)
          this.active = false;
          if (this.album.moveToAlbumId) {
            this.$router.push({name: 'AlbumsView', query: {artistId: this.albumData.artist.id}})
          }
        });
      }
    }
  }
}

</script>