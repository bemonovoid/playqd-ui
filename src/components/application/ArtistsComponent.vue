<template>
  <div>
    <v-row>
      <v-col class="text-right" align-self="center">
        <v-item-group class="pl-2">
          <v-btn color="success" text class="text-capitalize" v-text="selectBtnName" @click="showSelect = !showSelect"></v-btn>
          <v-btn v-if="showSelect" :disabled="selectedArtists.length < 1" color="success" text class="text-capitalize" @click="openEditDialog()">Edit</v-btn>
        </v-item-group>
      </v-col>
    </v-row>

    <v-subheader class="text-body-2">
      <span>Total: {{pagination.totalElements}}</span>
    </v-subheader>

    <v-row>
      <v-col>
        <v-data-table class="mb-15 pb-10"
                      height="950"
                      v-model="selectedArtists"
                      fixed-header
                      :headers="tableHeaders"
                      :items="artists"
                      :items-per-page.sync="pagination.pageSize"
                      :options="{page: pagination.page}"
                      :server-items-length="pagination.totalElements"
                      :loading="!dataLoaded"
                      loading-text="Loading artists... Please wait"
                      :show-select="showSelect"
                      :footer-props="{'items-per-page-options': [5, 10, 15, 20, 25, 50, 100 ]}"
                      @update:items-per-page="itemsPerPageUpdated"
                      @update:page="pageUpdated"
                      @update:sort-by="sortByUpdated"
                      @update:sort-desc="sortDirectionUpdated">

          <template v-slot:item="{ item, index }">
            <v-hover v-slot="{ hover }">
              <tr>

                <td class="mx-0 px-0 text-center">
                  <v-btn v-if="$store.state.playlist.nowPlaying && $store.state.playlist.nowPlaying.artist.id === item.id" small icon @click="resumePauseNowPlaying($store.state.audio.isPlaying)">
                    <v-icon color="red">{{$store.state.audio.isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                  </v-btn>
                  <v-btn v-else small icon :class="{ 'table-cell-hover': hover}" @click="play(item)">{{hover ? '' : (pagination.pageSize * pagination.page) - (pagination.pageSize - (index + 1))}}
                    <v-icon v-show="hover" :class="{ 'table-cell-hover': hover}">
                      mdi-play
                    </v-icon>
                  </v-btn>
                </td>

                <td class="mx-0 px-0 text-center">
                  <v-avatar tile size="40">
                    <v-img v-if="item.images" :src="item.images[0].url"></v-img>
                    <v-icon v-else color="grey">mdi-account-music</v-icon>
                  </v-avatar>
                </td>

                <td class="pl-0">
                  <v-list-item dense>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        <v-hover v-slot="{ hover }">
                          <a class="white--text" :class="{'text-decoration-underline' : hover}" @click="openArtist(item.id)">{{item.name}}</a>
                        </v-hover>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </td>

                <td class="text-center">
                  {{item.album_count}}
                </td>

                <td class="text-center">
                  {{item.song_count}}
                </td>

                <td>
                  <v-menu bottom offset-y>
                    <template v-slot:activator="{ on: menu, attrs }">
                      <v-tooltip bottom open-delay="400">
                        <template v-slot:activator="{ on: tooltip }">
                          <v-btn v-bind="attrs" v-on="{ ...tooltip, ...menu }" :class="{'table-cell-hover-new' : hover}" icon @mouseenter="hover" color="rgba(255, 255, 255, 0)">
                            <v-icon :class="{'table-cell-hover-new' : hover}" color="rgba(255, 255, 255, 0)">mdi-dots-horizontal</v-icon>
                          </v-btn>
                        </template>
                        <span>More</span>
                      </v-tooltip>
                    </template>
                    <v-list dense class="text-left" elevation="2">
                      <v-list-item-group color="primary">
                        <v-list-item dense>
                          <v-list-item-content>
                            <v-list-item-title>Edit</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item dense>
                          <v-list-item-content>
                            <v-list-item-title>Edit selection</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-menu>
                </td>

              </tr>
            </v-hover>
          </template>

        </v-data-table>
      </v-col>
    </v-row>

    <EditArtistComponent :selected-artists-prop="selectedArtists"></EditArtistComponent>
    <FullSizeImageComponent></FullSizeImageComponent>

  </div>
</template>

<script>

import {eventBus} from "@/main";
import api from "@/http/playqdAPI";

import ArtistComponent from "@/components/application/ArtistComponent";
import EditArtistComponent from "@/components/application/EditArtistComponent";
import FullSizeImageComponent from "@/components/application/FullSizeImageComponent";

export default {
  name: "ArtistsComponent",
  components: {FullSizeImageComponent, EditArtistComponent, ArtistComponent},
  data() {
    return {
      headers: [
        {text: '#',       align: 'center', sortable: false, value: 'idx', width: '1%'},
        {text: 'Art',     align: 'center', sortable: false, value: 'art',  width: '2%'},
        {text: 'Title',    align: 'start',  sortable: true,  value: 'name', width: '80%'},
        {text: 'Albums',  align: 'center', sortable: true,  value: 'album_count'},
        {text: 'Tracks',  align: 'center', sortable: true,  value: 'song_count'},
        {text: '',        align: 'start',  sortable: false, value: 'more'}
      ],
      artists: [],
      dataLoaded: false,
      showSelect: false,
      selectedArtists: [],
      artistsWithoutImage: [],
      pagination: {
        page: 1,
        pageSize: 15,
        totalElements: 0,
        totalPages: 0
      },
      sort: {
        by: "name",
        direction: 'ASC'
      },
    }
  },
  computed: {
    selectBtnName: function () {
      return this.showSelect ? 'Hide select' : 'Select';
    },
    tableHeaders: function () {
      return this.showSelect ? this.headers : this.headers.filter(header => header.value !== 'actions');
    }
  },
  mounted() {
    if (this.$route.query.page) {
      this.pagination.page = parseInt(this.$route.query.page).valueOf();
    }
    if (this.$route.query.size) {
      this.pagination.pageSize = parseInt(this.$route.query.size).valueOf();
    }
    this.findArtists();
    eventBus.$on('search-in-artists', searchQuery => {
      this.findArtists(searchQuery);
    });
  },
  methods: {
    getImage(id) {

    },
    resumePauseNowPlaying(isPlaying) {
      if (isPlaying) {
        eventBus.$emit('pause');
      } else {
        eventBus.$emit('resume-play');
      }
    },
    play(artist) {
      let nowPlayingSong = this.$store.state.playlist.nowPlaying;
      if (nowPlayingSong && nowPlayingSong.artist.id === artist.id) {
        eventBus.$emit('resume-play');
      } else {
        api.getArtistSongs(artist.id).then(response => {
          this.$store.commit('setPlaylist', {nowPlaying: response.data.songs[0], songs: response.data.songs});
          eventBus.$emit('play');
        });
      }
    },
    selectSingleUpdated(isMultiSelect) {
      if (!isMultiSelect && this.selectedArtists.length > 0) {
        this.selectedArtists = [];
      }
    },
    itemsPerPageUpdated(itemsPerPage) {
      console.log("itemsPerPageUpdated");
      this.pagination.pageSize = itemsPerPage;
      this.findArtists();
    },
    pageUpdated(page) {
      console.log("pageUpdated");
      this.pagination.page = page;
      this.findArtists();
    },
    sortDirectionUpdated(sortDirection) {
      console.log("sortDirectionUpdated");
      this.sort.direction = sortDirection.toString() === 'true' ? 'DESC' : 'ASC';
      this.findArtists();
    },
    sortByUpdated(sortBy) {
      console.log("sortByUpdated");
      this.sort.by = sortBy;
    },
    findArtists(name) {
      this.updateRouteQuery();
      this.showSelect = false;
      this.dataLoaded = false;
      this.selectedArtists = [];
      api.getArtists(this.pagination, this.sort, name).then(response => {
        this.artists = response.data.artists;
        this.pagination = {
          page: response.data.page + 1,
          pageSize: response.data.pageSize,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages
        };
        this.dataLoaded = true;
      });
    },
    openEditDialog() {
      eventBus.$emit('open-edit-artist-dialog');
    },
    openFullArtistImageDialog(artist) {
      eventBus.$emit('open-full-size-image-dialog', {title: artist.name, image: artist.images[artist.images.length - 1]});
    },
    openArtist(artistId) {
      this.$router.push({name: 'ArtistComponent', params: {artistId: artistId}})
    },
    albumsCountString(artist) {
      return artist.albumCount > 1 ? artist.albumCount + ' albums' : artist.albumCount + ' album';
    },
    albumSongsCountString(artist) {
      return artist.songCount > 1 ? artist.songCount + ' songs' : artist.songCount + ' song';
    },
    updateRouteQuery() {
      if (this.pagination.page !== this.$route.query.page || this.pagination.pageSize !== this.$route.query.size) {
        this.$router.push({query: {page: this.pagination.page, size: this.pagination.pageSize}});
      }
    }
  }
}
</script>

<style scoped>
.table-cell-hover {
  color: red;
}

.table-cell-hover-new {
  color: rgba(255, 255, 255, 1) !important;
}
/*.theme--dark.v-data-table {*/
/*  background-color: black;*/
/*}*/

/*.v-data-table__wrapper::-webkit-scrollbar {*/
/*  width: 7px;*/
/*  scrollbar-arrow-color: seagreen;*/
/*}*/

/*.v-data-table__wrapper::-webkit-scrollbar-track {*/
/*  background: black;*/
/*  !*border-left: 1px solid #dadada;*!*/
/*}*/

/*.v-data-table__wrapper::-webkit-scrollbar-thumb {*/
/*  background: seagreen;*/
/*}*/

/*.v-data-table__wrapper::-webkit-scrollbar-thumb:hover {*/
/*  background: darkgray;*/
/*}*/

</style>