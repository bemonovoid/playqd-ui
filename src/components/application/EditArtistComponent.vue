<template>
  <v-dialog v-model="dialog" persistent max-width="600" hide-overlay>
    <v-card elevation="0" height="600" max-width="600" v-if="dialog === true">
      <v-card-title v-if="editMultipleArtists">
        <v-list-item-avatar size="60">
          <v-img src="@/assets/default-album-cover.png"></v-img>
        </v-list-item-avatar>
        <span>{{ selectedArtistsProp.length }} artists selected</span>
        <v-card-subtitle>
          <span class="text--secondary">({{ artistsSongCount }} songs)</span>
        </v-card-subtitle>
      </v-card-title>

      <v-card-title v-else>
        <v-avatar tile size="70">
          <v-img v-if="this.selectedArtistsProp[0].images" :src="this.selectedArtistsProp[0].images[0].url"></v-img>
          <v-img v-else src="@/assets/default-album-cover.png"></v-img>
        </v-avatar>
        <span class="pl-5">{{ selectedArtistsProp[0].name }}</span>
        <v-card-subtitle>
          <span class="text--secondary">({{ artistsSongCount }} songs)</span>
        </v-card-subtitle>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-tabs color="success" v-model="tab" class="fill-height">
          <v-tab key="details" class="text-capitalize">Details</v-tab>
          <v-tab v-if="!editMultipleArtists" key="artwork" class="text-capitalize">Artwork</v-tab>
          <v-tab v-if="!editMultipleArtists" key="details3" class="text-capitalize">Misc</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">

          <v-tab-item key="details" class="px-5">
            <v-row>
              <v-col>
                <v-form class="py-5">
                  <v-text-field label="Name" color="grey"></v-text-field>
                  <div v-if="!editMultipleArtists">
                    <v-text-field label="Country" color="grey"></v-text-field>
                  </div>
                  <v-checkbox v-model="updateModel.details.tags"
                              label="Update file tag(s) if supported by tagging format" color="success"
                              hide-details></v-checkbox>
                </v-form>
              </v-col>
            </v-row>
          </v-tab-item>

          <v-tab-item key="artwork">
            <v-row>
              <v-col class="text-left pt-5">
                <v-btn text class="text-capitalize" color="success" @click="findArtwork()">Find on Spotify</v-btn>
              </v-col>
            </v-row>
            <v-row v-if="foundImages.length > 0">
              <v-col class="text-left" align-self="center" md="auto">
                <v-list-item-avatar tile size="185">
                  <v-img :src="foundImages[0].url"></v-img>
                </v-list-item-avatar>
              </v-col>
              <v-col class="text-left" align-self="center">
                <v-list>
                  <v-list-item-group multiple v-model="updateModel.images">
                    <template v-for="image in foundImages">
                      <v-list-item :value="image">
                        <template v-slot:default="{ active }">
                          <v-list-item-content>
                            <v-list-item-title>{{ image.dimensions.height + ' x ' + image.dimensions.width }}
                            </v-list-item-title>
                            <v-list-item-subtitle>{{ image.url }}</v-list-item-subtitle>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-checkbox :input-value="active" color="success"></v-checkbox>
                          </v-list-item-action>
                        </template>
                      </v-list-item>

                    </template>

                  </v-list-item-group>
                </v-list>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>

      </v-card-text>
    </v-card>

    <v-sheet>
      <v-item-group class="text-right pb-5">
        <v-btn text class="text-capitalize" color="success" @click="save()">
          {{ saveBtnName }}
        </v-btn>
        <v-btn text class="text-capitalize" color="success" @click="dialog = false">
          Close
        </v-btn>
      </v-item-group>
    </v-sheet>

  </v-dialog>

</template>

<script>

import {eventBus} from "@/main";
import api from "@/http/playqdAPI";

export default {
  name: "EditArtistComponent",
  props: ['selectedArtistsProp'],
  data() {
    return {
      dialog: false,
      tab: null,
      foundImages: [],
      updateModel: {
        details: {
          artistIds: this.selectedArtistsProp.map(artist => artist.id),
          tags: false,
        },
        images: [],
        misc: null
      }
    }
  },
  computed: {
    editMultipleArtists: function () {
      return this.selectedArtistsProp.length > 1;
    },
    artistsSongCount: function () {
      return this.selectedArtistsProp.map(item => item.song_count).reduce((a, b) => a + b, 0);
    },
    saveBtnName: function () {
      if (this.tab) {
        if (this.tab === 0) return 'Save details'
        if (this.tab === 1) return 'Save artwork'
        if (this.tab === 2) return 'Save misc'
      } else {
        return 'Save details';
      }
    }
  },
  mounted() {
    eventBus.$on('open-edit-artist-dialog', data => {
      this.dialog = true;
    });
  },
  methods: {
    save() {
      let apiResponse = null;

      if (this.tab === 0) {
        if (this.editMultipleArtists) {
          apiResponse = api.updateArtistGroup(this.updateModel.details);
        } else {
          apiResponse = api.updateArtistDetails(this.selectedArtistsProp[0].id, this.updateModel.details);
        }
      } else if (this.tab === 1) {
        apiResponse = api.addArtistImages(this.selectedArtistsProp[0].id, this.updateModel.images);
      } else if (this.tab === 2) {
        apiResponse = api.updateArtistMisc(this.updateModel.misc);
      } else {
        return;
      }

      apiResponse.then(response => {
        eventBus.$emit('search-in-artists');
        this.dialog = false;
      });
    },
    findArtwork() {
      api.findArtistImages(this.selectedArtistsProp[0].id).then(response => {
        this.foundImages = response.data;
      });
    }
  }
}
</script>

<style scoped>

</style>