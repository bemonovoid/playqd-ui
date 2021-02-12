<template>

  <v-dialog v-model="active" persistent max-width="500px">

    <template v-slot:activator="{ on, attrs }">
      <v-btn small fab icon v-bind="attrs" v-on="on">
        <v-icon small>mdi-file-document-edit-outline</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="headline">Edit Artist</span>
      </v-card-title>
      <v-card-text>

        <v-form v-model="editForm.valid">
          <v-text-field dense label="Name"
                        required
                        persistent-hint
                        :hint="artistData.name"
                        v-model="artist.name"
                        :rules="editForm.artistNameRules">
          </v-text-field>

          <v-text-field dense label="Country code" class="pt-5"
                        persistent-hint
                        :hint="artistData.country"
                        v-model="artist.country"
                        :rules="editForm.artistCountryRules">
          </v-text-field>
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
import countryCodes from 'country-code-lookup';

export default {
  name: 'EditAlbumsArtistView',
  props: ['artistData'],
  components: {countryCodes},
  data() {
    return {
      active: false,
      editForm: {
        valid: false,
        artistNameRules: [
          v => !!v || 'Name is required'
        ],
        artistCountryRules: [
            v => v.length < 3 || 'Country code length must be equal 2'
        ]
      },
      artist: {
        name: this.artistData.name,
        country: this.artistData.country
      },
    }
  },
  methods: {
    saveChanges() {
      if (this.editForm.valid) {
        HTTP_CLIENT.put('/library/artists/' + this.artistData.id, this.artist).then(response => {
            this.active = false;
        });
      }
    }
  }
}

</script>