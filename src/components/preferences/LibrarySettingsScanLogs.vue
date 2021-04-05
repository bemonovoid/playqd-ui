<template>

  <v-data-table :headers="headers" :items="items" :items-per-page="pagination.pageSize">

    <template v-slot:top>
      <v-toolbar flat>
        <v-spacer></v-spacer>
        <v-btn small outlined depressed @click="refreshScanLogs()">Refresh
          <v-icon color="success">mdi-refresh</v-icon>
        </v-btn>

      </v-toolbar>
    </template>

  </v-data-table>

</template>

<script>

import api from "@/http/playqdAPI"

export default {
  name: "LibrarySettingsScanLogs",
  data() {
    return  {
      headers: [
        {text: 'Date',            align: 'start', sortable: true,  value: 'scanDate'},
        {text: 'Directory',       align: 'start', sortable: false, value: 'scanDirectory'},
        {text: 'Delete all',      align: 'start', sortable: false, value: 'deleteAllBeforeScan'},
        {text: 'Files scanned',   align: 'start', sortable: false, value: 'filesIndexed'},
        {text: 'Files missing',   align: 'start', sortable: false, value: 'indexedFilesMissing'},
        {text: 'Scan time (ms)',  align: 'start', sortable: false, value: 'durationInMillis'},
        {text: 'Status',          align: 'start', sortable: false, value: 'status'},
        {text: 'Status details',  align: 'start', sortable: false, value: 'statusDetails'}
      ],
      items: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0
      }
    }
  },
  mounted() {
    this.refreshScanLogs();
  },
  methods: {
    refreshScanLogs() {
      api.getScanLogs(this.pagination).then(response => {
        this.items = response.data.scans;
        this.pagination = { page: response.data.page + 1, pageSize: response.data.pageSize, totalElements: response.data.totalElements, totalPages: response.data.totalPages };
      });
    }
  }
}
</script>

<style scoped>

</style>