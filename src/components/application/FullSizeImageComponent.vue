<template>
  <v-dialog v-if="dialog === true" v-model="dialog" :max-width="image.dimensions.width" transition="in-out">
    <v-card class="align-center" elevation="3">
      <v-img class="white--text align-end" :src="image.url">
        <v-card-title>{{title}}</v-card-title>
      </v-img>
    </v-card>
  </v-dialog>
</template>

<script>

import {eventBus} from "@/main";

export default {
  name: "FullSizeImageComponent",
  data() {
    return {
      image: null,
      title: null,
      dialog: false
    }
  },
  mounted() {
    eventBus.$on('open-full-size-image-dialog', data => {
      this.image = data.image;
      this.title = data.title;
      this.dialog = true;
    });
  }
}
</script>

<style scoped>

</style>