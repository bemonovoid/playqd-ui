<template>
  <v-app-bar dense color="blue-grey lighten-3" fixed flat elevation="0">

    <v-app-bar-nav-icon></v-app-bar-nav-icon>

    <v-toolbar-title>Playqd</v-toolbar-title>

    <v-spacer/>

    <v-btn icon>
      <v-icon>mdi-account</v-icon>
    </v-btn>


  </v-app-bar>

</template>

<script>

import {eventBus} from "@/main";
import {HTTP_CLIENT} from "@/http/axios-config";

export default {
  name: 'NavToolbarView',
  components: {

  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
  }
}

</script>