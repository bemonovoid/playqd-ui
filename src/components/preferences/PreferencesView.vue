<template>

  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="2" class="text-left">
          <v-navigation-drawer>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5">
                  Preferences
                </v-list-item-title>
                <v-list-item-subtitle>
                  Manage playqd settings
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense nav>
              <v-list-item-group color="primary" v-model="selectedSettingsIdx">
                <v-list-item v-for="item in items" :key="item.id" @click="openSettingsView(item.id)">
                  <v-list-item-content>
                    <v-list-item-title>{{item.title}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>

          </v-navigation-drawer>
        </v-col>

<!--        <v-divider vertical></v-divider>-->

        <v-col>
          <router-view></router-view>
        </v-col>

        <v-col cols="1" md="auto">
          <v-btn icon :to="{name: 'LibraryView'}">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>

      </v-row>
    </v-card-text>
  </v-card>

</template>

<script>

export default {
  name: "PreferencesView",
  data() {
    return {
      selectedSettingsIdx: 0,
      items: [
          { id: "LibrarySettingsView", title: "Library"}
      ]
    }
  },
  methods: {
    openSettingsView(viewName) {
      this.$router.push({name: viewName})
    }
  }
}
</script>

<style scoped>

</style>