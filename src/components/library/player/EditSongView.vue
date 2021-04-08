<template>

  <v-dialog v-model="active" persistent max-width="500px">

    <template v-slot:activator="{ on, attrs }">
      <v-btn small icon v-bind="attrs" v-on="on">
        <v-icon color="success" small>mdi-file-document-edit-outline</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="headline">Edit Song</span>

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
                    <v-text-field dense label="Name" persistent-hint :hint="songData.name" v-model="song.name"></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field dense label="Track ID" persistent-hint :hint="songData.trackId" v-model="song.trackId"></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-textarea clearable rows="1" clear-icon="mdi-close-circle" v-model="song.comment" label="Comment"></v-textarea>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-textarea clearable rows="3" clear-icon="mdi-close-circle" v-model="song.lyrics" label="Lyrics"></v-textarea>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-btn small depressed block color="primary" class="text-capitalize" @click="updateSongProperties()">
                      Save properties
                    </v-btn>
                  </v-col>
                </v-row>

              </v-form>

            </v-expansion-panel-content>

          </v-expansion-panel>

          <v-expansion-panel @change="getArtists()">

            <v-expansion-panel-header>
              Miscellaneous
            </v-expansion-panel-header>

            <v-expansion-panel-content>

              <v-row align="center" class="pl-3 pt-5">
                <v-autocomplete dense label="Move to existing artist" class="pt-5 pr-3"
                                clearable
                                persistent-hint
                                :hint="songData.artist.name"
                                item-text="name"
                                item-value="id"
                                @change="getArtistAlbums"
                                v-model="moveToArtistId"
                                :items="this.artists">
                </v-autocomplete>
              </v-row>

              <v-row v-if="this.moveToArtistId" align="center" class="pt-5">
                <v-autocomplete dense label="Move to existing album" class="pt-5 pr-3 text-left"
                                clearable
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
                    <v-switch dense color="info" hide-details v-model="song.updateAudioTags"></v-switch>
                  </v-list-item-action>
                </v-list-item>
              </v-row>

              <v-row>
                <v-col>
                  <v-btn small depressed block color="primary" class="text-capitalize" :disabled="!moveToAlbumId" @click="moveSong()">Move</v-btn>
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

import api from "@/http/playqdAPI"

export default {
  name: 'EditPlayerSongView',
  props: ['songData'],
  data() {
    return {
      active: false,
      editForm: {
        valid: false,
      },
      artists: [],
      artistAlbums: [],
      moveToArtistId: null,
      moveToAlbumId: null,
      song: {
        id: this.songData.id,
        name: this.songData.name,
        comment: this.songData.comment,
        lyrics: this.songData.lyrics,
        trackId: this.songData.trackId,
        updateAudioTags: true,
      },
    }
  },
  methods: {
    getArtists() {
      api.getAllBasicArtists().then(response => {
        this.artists = response.data.artists.filter(art => art.id !== this.songData.artist.id);
      });
    },
    getArtistAlbums() {
      api.getAlbums({ page: 1, pageSize: 100, name: this.albumNameQuery, artistId: this.moveToArtistId }).then(response => {
        this.artistAlbums = response.data.albums;
      });
    },
    updateSongProperties() {
      if (this.editForm.valid) {
        api.updateSong(this.song).then(response => {
          this.$store.commit('updateCurrentSong', response.data);
          this.active = false;
        });
      }
    },
    moveSong() {
      let moveConfig = { songId: this.songData.id, albumIdTo: this.moveToAlbumId, updateAudioTags: this.song.updateAudioTags }
      api.moveSong(moveConfig).then(response => {
        this.active = false;
        this.$router.push({name: 'AlbumSongsView', params: {albumId: this.moveToAlbumId}});
      })
    }
  }
}

</script>