<template>

  <v-row>

    <v-col class="py-0">

      <v-list align="left">

        <v-subheader><h1>Library</h1></v-subheader>

        <v-list-item-group color="primary">

          <v-list-item v-for="(item, i) in items" :key="i" @click="showItem(item.viewName)">

            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-action>

          </v-list-item>

        </v-list-item-group>

      </v-list>
    </v-col>

  </v-row>

</template>

<script>

export default {
  name: 'LibraryView',
  components: {

  },
  data() {
    return {
      items: [
        {
          title: "Artists",
          icon: "mdi-account-music",
          viewName: "ArtistsView"
        },
        {
          title: "Albums",
          icon: "mdi-folder-music-outline",
          viewName: "AlbumsView"
        },
        {
          title: "Songs",
          icon: "mdi-music-note",
          viewName: "SongsView"
        },
        {
          title: "Genres",
          icon: "mdi-guitar-electric",
          viewName: "GenresView"
        }
      ]
    }
  },
  methods: {
    showItem(viewName) {
      this.$router.push({name: viewName});
    }
  }
}

</script>