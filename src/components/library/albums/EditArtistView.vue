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

        <v-form v-model="editForm.valid" class="pt-5">

          <v-text-field dense label="Name"
                        persistent-hint
                        :disabled="moveToExistingArtist"
                        :hint="artistData.name"
                        v-model="artist.name">
          </v-text-field>

          <v-text-field dense label="Country code" class="pt-5"
                        persistent-hint
                        :disabled="moveToExistingArtist"
                        :hint="artistData.country"
                        v-model="artist.country"
                        :rules="editForm.artistCountryRules">
          </v-text-field>

          <v-row align="center" class="pt-5">
            <v-checkbox hide-details class="mt-0" v-model="moveToExistingArtist"></v-checkbox>
            <v-autocomplete dense label="Move to existing artist" class="pt-5 pr-3"
                            clearable
                            persistent-hint
                            :disabled="!moveToExistingArtist"
                            :hint="artistData.name"
                            item-text="name"
                            item-value="id"
                            v-model="artist.id"
                            :items="this.$store.state.artists">
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

import {HTTP_CLIENT} from "@/http/axios-config";
import countryCodes from 'country-code-lookup';

export default {
  name: 'EditAlbumsArtistView',
  props: ['artistData'],
  components: {countryCodes},
  data() {
    return {
      active: false,
      moveToExistingArtist: false,
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
        id: this.artistData.id,
        name: this.artistData.name,
        country: this.artistData.country
      },
    }
  },
  mounted() {
    if (this.$store.state.artists > 0) {
    } else {
      HTTP_CLIENT.get('/library/artists/').then(response => {
        this.$store.commit('setArtists', response.data.artists);
      });
    }
  },
  methods: {
    saveChanges() {
      if (this.editForm.valid) {
        HTTP_CLIENT.put('/library/artists/' + this.artistData.id, this.artist).then(response => {
            this.active = false;
            if (this.artistData.id !== this.artist.id) {
              this.$router.push({name: 'ArtistsView'})
            }
        });
      }
    }
  }
}

</script>