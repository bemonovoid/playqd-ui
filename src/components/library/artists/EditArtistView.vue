<template>

  <v-dialog v-model="active" persistent max-width="500px">

    <template v-slot:activator="{ on, attrs }">
      <v-btn small fab icon v-bind="attrs" v-on="on">
        <v-icon small>mdi-file-document-edit-outline</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>

        <v-list-item-avatar>
          <v-img :src="$store.getters.getArtistBaseUrl + artist.id + '/image'" @error="imageError"></v-img>
        </v-list-item-avatar>

        <span class="headline">Edit Artist</span>

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
                <v-text-field dense label="Name" class="pt-5" persistent-hint :hint="artistData.name" v-model="artist.name"></v-text-field>
              </v-row>

              <v-row>
                <v-text-field dense label="Country code" class="pt-5" persistent-hint :hint="artistData.country" v-model="artist.country" :rules="editForm.artistCountryRules"></v-text-field>
              </v-row>

              <v-row>
                <v-list-item>
                  <v-list-item-title class="text-left">Update audio file tags</v-list-item-title>
                  <v-list-item-action>
                    <v-switch dense color="info" hide-details v-model="artist.updateAudioTags"></v-switch>
                  </v-list-item-action>
                </v-list-item>
              </v-row>

              <v-row>
                <v-col>
                  <v-btn small depressed block color="primary" class="text-capitalize" @click="updateArtistProperties()">
                    Save properties
                  </v-btn>
                </v-col>
              </v-row>

              </v-form>

            </v-expansion-panel-content>

          </v-expansion-panel>

          <v-expansion-panel @change="prepareMoveArtistForm()">

            <v-expansion-panel-header>
              Miscellaneous
            </v-expansion-panel-header>

            <v-expansion-panel-content>

              <v-row align="center" class="pl-3 pt-5">
                <v-autocomplete dense label="Move to existing artist" class="pt-5 pr-3"
                                clearable
                                persistent-hint
                                :hint="artistData.name"
                                item-text="name"
                                item-value="id"
                                v-model="artist.id"
                                :items="this.$store.state.artists">
                </v-autocomplete>
              </v-row>

              <v-row>
                <v-list-item>
                  <v-list-item-title class="text-left">Update audio file tags</v-list-item-title>
                  <v-list-item-action>
                    <v-switch dense color="info" hide-details v-model="artist.updateAudioTags"></v-switch>
                  </v-list-item-action>
                </v-list-item>
              </v-row>

              <v-row>
                <v-col>
                  <v-btn small depressed block color="primary" class="text-capitalize">Move</v-btn>
                </v-col>
              </v-row>

            </v-expansion-panel-content>

          </v-expansion-panel>

          <v-expansion-panel v-if="!showArtistImage">
            <v-expansion-panel-header>
              Image
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <v-btn link @click="findArtistImage()">Find artist image</v-btn>
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
import countryCodes from 'country-code-lookup';

export default {
  name: 'EditAlbumsArtistView',
  props: ['artistData', 'artistImageFound'],
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
      showArtistImage: true,
      artist: {
        id: this.artistData.id,
        name: this.artistData.name,
        country: this.artistData.country,
        updateAudioTags: true
      },
    }
  },
  methods: {
    prepareMoveArtistForm() {
      if (this.$store.state.artists.length === 0) {
        api.getArtists().then(response => {
          this.$store.commit('setArtists', response.data.artists);
        });
      }
    },
    imageError() {
      this.showArtistImage = false;
    },
    updateArtistProperties() {
      if (this.editForm.valid) {
        api.updateArtist(this.artist).then(response => {
            this.active = false;
            // if (this.artist.moveToArtistId) {
            //   this.$router.push({name: 'ArtistsView'})
            // }
        });
      }
    },
    findArtistImage() {
      api.getArtistImageSrc(this.artistData.id).then(response => {
        this.$emit('update:artistImageFound', true)
        this.active = false;
      })

    }
  }
}

</script>