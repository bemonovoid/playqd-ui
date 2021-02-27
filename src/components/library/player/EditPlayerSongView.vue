<template>

  <v-dialog v-model="active" persistent max-width="500px">

    <template v-slot:activator="{ on, attrs }">
      <v-btn small fab icon v-bind="attrs" v-on="on" class="pr-5">
        <v-icon small>mdi-file-document-edit-outline</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="headline">Edit Song</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="editForm.valid" class="pt-5">
          <v-text-field dense label="Name"
                        persistent-hint
                        :hint="songData.name"
                        v-model="song.name">
          </v-text-field>

          <v-textarea
              clearable
              rows="1"
              clear-icon="mdi-close-circle"
              v-model="song.comment"
              label="Comment">
          </v-textarea>

          <v-textarea
              clearable
              rows="3"
              clear-icon="mdi-close-circle"
              v-model="song.lyrics"
              label="Lyrics">
          </v-textarea>

          <v-text-field dense label="Artwork url" class="pt-5"
                        persistent-hint
                        hint="URL"
                        v-model="song.artworkSrc">
          </v-text-field>

          <v-checkbox label="Override song name with file name" color="red" v-model="song.overrideSongNameWithFileName"></v-checkbox>

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
      song: {
        id: this.songData.id,
        name: this.songData.name,
        comment: this.songData.comment,
        lyrics: this.songData.lyrics,
        overrideSongNameWithFileName: this.songData.showFileNameAsSongName,
        artworkSrc: ''
      },
    }
  },
  methods: {
    saveChanges() {
      if (this.editForm.valid) {
        api.updateSong(this.song).then(response => {
          this.active = false;
        });
      }
    }
  }
}

</script>