<template>

  <v-row>

    <v-col>

      <v-list align="left">

        <v-subheader><h1>Library</h1></v-subheader>

        <v-list-item-group color="primary">

          <v-list-item v-for="(item, i) in items" :key="i" @click="showItem('artists')">

            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>

          </v-list-item>

        </v-list-item-group>

      </v-list>
    </v-col>

  </v-row>


</template>

<script>

import {mdiAccountMusic, mdiPlaylistPlay, mdiPlaylistMusic} from '@mdi/js'

export default {
  name: 'LibraryView',
  components: {
    mdiAccountMusic, mdiPlaylistPlay, mdiPlaylistMusic
  },
  data() {
    return {
      items: [
        {
          title: "Artists",
          icon: "mdi-account-music",
          route: ""
        },
        {
          title: "Albums",
          icon: "mdi-playlist-play",
          route: ""
        },
        {
          title: "Songs",
          icon: "mdi-playlist-music",
          route: ""
        }
      ]
    }
  },
  methods: {
    showItem(name) {
      this.$router.push("/library/" + name);
    }
  }
}

</script>