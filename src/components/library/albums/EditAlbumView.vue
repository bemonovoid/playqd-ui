<template>

  <v-dialog v-model="active" persistent max-width="500px">

    <template v-slot:activator="{on, attrs}">
      <v-btn small fab icon v-bind="attrs" v-on="on">
        <v-icon small>mdi-file-document-edit-outline</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>

        <v-list-item-avatar>
          <v-img :src="$store.getters.getResourceBaseUrl + 'image/?resourceId=' + albumData.resourceId" @error="imageError"></v-img>
        </v-list-item-avatar>

        <span class="headline">Edit Album</span>

        <v-spacer></v-spacer>

        <v-btn icon @click="active = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>

        <v-expansion-panels focusable accordion>

          <v-expansion-panel>

            <v-expansion-panel-header>
              Properties
            </v-expansion-panel-header>

            <v-expansion-panel-content>

              <v-form v-model="editForm.valid" class="pt-5">

                <v-row>
                  <v-col>
                    <v-text-field dense label="Album Name" persistent-hint :hint="albumData.name" v-model="album.name"></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field dense label="Genre" class="pt-5" persistent-hint :hint="albumData.genre" v-model="album.genre"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field dense label="Year" class="pt-5" persistent-hint :hint="albumData.date" v-model="album.date">
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-list-item>
                    <v-list-item-title class="text-left">Update audio file tags</v-list-item-title>
                    <v-list-item-action>
                      <v-switch dense color="info" hide-details v-model="album.updateAudioTags"></v-switch>
                    </v-list-item-action>
                  </v-list-item>
                </v-row>

                <v-row>
                  <v-col>
                    <v-btn small depressed block color="primary" class="text-capitalize" @click="updateAlbumProperties()">
                      Save properties
                    </v-btn>
                  </v-col>
                </v-row>

              </v-form>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>
              Preferences
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-list-item class="pt-5">
                  <v-list-item-title class="text-left">Song name as file name</v-list-item-title>
                  <v-list-item-action>
                    <v-switch dense color="info" hide-details v-model="album.preferences.songNameAsFileName" @change="updateAlbumPreferences()"></v-switch>
                  </v-list-item-action>
                </v-list-item>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel @change="getArtistAlbums()">

            <v-expansion-panel-header>
              Miscellaneous
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <v-row align="center" class="pt-5">
                <v-autocomplete dense label="Move to existing album" class="pt-5 pr-3 text-left"
                                clearable
                                persistent-hint
                                :hint="albumData.name"
                                item-text="name"
                                item-value="id"
                                v-model="moveToAlbumId"
                                :items="artistAlbums">
                </v-autocomplete>
              </v-row>
              <v-row>
                <v-list-item>
                  <v-list-item-title class="text-left">Update audio file tags</v-list-item-title>
                  <v-list-item-action>
                    <v-switch dense color="info" hide-details v-model="album.updateAudioTags"></v-switch>
                  </v-list-item-action>
                </v-list-item>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn small depressed block color="primary" class="text-capitalize" :disabled="!moveToAlbumId" @click="moveAlbum()">Move</v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel v-if="!showAlbumImage">
            <v-expansion-panel-header>
              Image
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <v-row>
                <v-col class="pt-5">
                  <v-btn small depressed block color="primary" class="text-capitalize" @click="findAlbumImage()">Find album image</v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>

          </v-expansion-panel>

        </v-expansion-panels>

      </v-card-text>
    </v-card>
  </v-dialog>

</template>

<script>

import {eventBus} from "@/main";
import api from "@/http/playqdAPI"

export default {
  name: 'EditAlbumView',
  props: ['albumData', 'albumImageFound'],
  data() {
    return {
      active: false,
      editForm: {
        valid: false
      },
      artistAlbums: [],
      showAlbumImage: true,
      album: {
        id: this.albumData.id,
        name: this.albumData.name,
        genre: this.albumData.genre,
        date: this.albumData.date,
        updateAudioTags: true,
        preferences: {
          songNameAsFileName: this.albumData.preferences ? this.albumData.preferences.songNameAsFileName : false,
        },
        artworkSrc: null
      },
      moveToAlbumId: null
    }
  },
  mounted() {

  },
  methods: {
    imageError() {
      this.showAlbumImage = false;
    },
    getArtistAlbums() {
      api.getAlbums({ page: 1, pageSize: 100, name: this.albumNameQuery, artistId: this.albumData.artist.id }).then(response => {
        this.artistAlbums = response.data.albums.filter(alb => alb.id !== this.albumData.id);
      });
    },
    updateAlbumProperties() {
      if (this.editForm.valid) {
        api.updateAlbumProperties(this.album).then(response => {
          eventBus.$emit('album-data-updated', this.album)
          this.active = false;
        });
      }
    },
    updateAlbumPreferences() {
      api.updateAlbumPreferences(this.albumData.id, this.album.preferences).then(response => {
        eventBus.$emit('album-preferences-updated', this.album.preferences)
        this.active = false;
      });
    },
    moveAlbum() {
      let moveConfig = { albumIdFrom: this.albumData.id, albumIdTo: this.moveToAlbumId, updateAudioTags: this.album.updateAudioTags };
      api.moveAlbum(moveConfig).then(response => {
        this.active = false;
        this.$router.push({name: 'AlbumsView', query: {artistId: this.albumData.artist.id}})
      });
    },
    findAlbumImage() {
      api.getAlbumImageSrc(this.albumData.id).then(response => {
        this.$emit('update:albumImageFound', true)
        this.active = false;
      });
    }
  }
}

</script>