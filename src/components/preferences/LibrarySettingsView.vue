<template>
  <v-card class="text-left" elevation="0">
    <v-card-title>Library settings</v-card-title>
    <v-card-subtitle>Manage library settings here</v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-content class="pl-2">
            <v-switch dense color="info" hide-details label="Rescan folders at startup" v-model="settings.rescanAtStartup"></v-switch>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content class="pl-2">
            <v-switch dense color="info" hide-details label="Drop database before scan" v-model="settings.deleteBeforeScan"></v-switch>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-card-actions>
      <v-btn style="text-transform: none" color="primary" text outlined @click="save">
        <v-icon left>mdi-content-save-outline</v-icon>
        Save
      </v-btn>
      <v-btn style="text-transform: none" color="primary" text outlined @click="rescan">
        <v-icon left>mdi-refresh</v-icon>
        Rescan
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

import api from "@/http/playqdAPI"

export default {
  name: "LibrarySettingsView",
  data() {
    return {
      settings: {
        rescanAtStartup: false,
        deleteBeforeScan: false
      }
    }
  },
  mounted() {
    api.getLibrarySettings().then(response => {
      this.settings = response.data;
    });
  },
  methods: {
    save() {
      api.saveLibrarySettings(this.settings).then(response => {

      });
    },
    rescan() {
      api.rescanLibrary(this.settings).then(response => {

      });
    }
  }
}
</script>

<style scoped>

</style>