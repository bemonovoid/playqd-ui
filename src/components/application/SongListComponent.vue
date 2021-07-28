<template>
  <div class="mb-15 pb-10">

    <v-row>
      <v-col>
        <span class="text--secondary text-h4">Queue</span>
      </v-col>
    </v-row>

    <v-row v-if="this.$store.state.playlist.queue.length > 0">
      <v-col align-self="start">

        <v-list dense class="mr-15 pr-10">

          <v-subheader>Now playing</v-subheader>

          <SongListItemComponent :song="this.$store.state.playlist.nowPlaying"></SongListItemComponent>

          <v-subheader>Playing next</v-subheader>

          <template v-for="(song, index) in this.$store.state.playlist.queue.filter(s => s.id !== this.$store.state.playlist.nowPlaying.id)">
            <SongListItemComponent :song="song" :index="index"></SongListItemComponent>
          </template>

        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import SongListItemComponent from "@/components/application/SongListItemComponent";

export default {
  name: "SongListComponent",
  components: {SongListItemComponent},
  props: ['showHeaders']
}
</script>
