<template>

  <div>

    <b-modal ref="songInfoModalRef" size="lg" hide-footer>

      <template #modal-title>
        <div>
          {{currentSong.artist.name}} - {{currentSong.album.name}} ({{currentSong.album.date}})
        </div>
        <div>
          <p class="scoped-song-name">{{currentSong.name}}</p>
        </div>
      </template>

      <b-container fluid>
        <b-row>
          <b-col>
            <p>Bit rate: {{currentSong.audioBitRate}} kbps</p>
            <p>Sample rate: {{currentSong.audioSampleRate}} Hz</p>
            <p>Channels: {{currentSong.audioChannelType}} / {{currentSong.audioEncodingType}}</p>
            <p>Format: {{currentSong.fileExtension}}</p>
          </b-col>
        </b-row>
      </b-container>

    </b-modal>

  </div>

</template>

<script>

export default {
  name: 'PlayerSongInfoModal',
  props: [
      'currentSong'
  ],
  methods: {
    showSongInfoModal() {
      this.$refs.songInfoModalRef.show();
    }
  }
}


</script>

<style scoped>

  .scoped-song-name {
    color: #E34C2C;
  }

</style>