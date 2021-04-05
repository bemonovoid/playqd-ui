<template>

  <v-sheet>

    <v-list-item class="text-left">
      <v-list-item-content>
        <v-list-item-title class="text-h5">Library settings</v-list-item-title>
        <v-list-item-subtitle>Manage library settings here</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>
    <v-tabs v-model="tab" color="success">
      <v-tab>Scan</v-tab>
      <v-tab @change="getScanLogs()">Logs</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card class="text-left" elevation="0">
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-content class="pl-2">
                  <v-switch dense color="success" hide-details label="Rescan folders at startup" v-model="settings.rescanAtStartup"></v-switch>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="pl-2">
                  <v-switch dense color="success" hide-details label="Delete missing" v-model="settings.deleteMissing"></v-switch>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="pl-2">
                  <v-switch dense color="success" hide-details label="Drop database before scan" v-model="settings.deleteBeforeScan"></v-switch>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions>
            <v-btn style="text-transform: none" color="success" text outlined @click="save">
              <v-icon left>mdi-content-save-outline</v-icon>
              Save
            </v-btn>
            <v-btn style="text-transform: none" color="success" text outlined @click="rescan">
              <v-icon left>mdi-refresh</v-icon>
              Rescan
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <LibrarySettingsScanLogs></LibrarySettingsScanLogs>
      </v-tab-item>
    </v-tabs-items>

  </v-sheet>


</template>

<script>

import api from "@/http/playqdAPI"
import LibrarySettingsScanLogs from "@/components/preferences/LibrarySettingsScanLogs";

export default {
  name: "LibrarySettingsView",
  components: {LibrarySettingsScanLogs},
  data() {
    return {
      tab: null,
      settings: {
        rescanAtStartup: false,
        deleteMissing: false,
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