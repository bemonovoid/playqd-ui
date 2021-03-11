<template>

  <div v-if="this.artists.length > 0">
    <v-row>

      <v-col class="py-0 px-0 text-left">
        <v-list-item>

          <v-list-item-content>
            <v-list-item-title class="display-1">Artists</v-list-item-title>
            <v-list-item-subtitle class="text-caption text--disabled">
              Total: {{pagination.totalElements}}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-menu offset-y left>
              <template v-slot:activator="{ attrs, on}">
                <v-btn fab small icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>

              <v-list dense class="text-left">
                <v-subheader>Sort artists</v-subheader>
                <v-list-item-group color="primary" v-model="selectedSortType.idx">
                  <v-list-item v-for="(sortType, i) in sorting.types" :key="i" @click="sortArtists(sortType)">
                    <v-list-item-title>{{sortType.name}}</v-list-item-title>
                    <v-list-item-icon>
                      <v-icon right small>{{sortType.icon}}</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="py-0">

        <v-list align="left" class="py-0">

          <v-item-group align="left" class="py-0">
            <v-text-field flat dense clearable placeholder="Find in artists"
                          v-model="artistNameQuery"
                          @click:clear="clearInput()"
                          prepend-inner-icon="mdi-format-text-rotation-none"
                          append-outer-icon="mdi-magnify"
                          @click:append-outer="findArtistsByName()">
            </v-text-field>
          </v-item-group>

          <v-list-item-group color="primary">

            <v-list-item v-for="(artist, i) in artists" :key="i" class="px-0" :to="{name: 'AlbumsView', query: {artistId: artist.id}}">

              <v-list-item-avatar v-if="artistsWithImageNotFound.includes(artist.id)" class="ml-0 mr-2">
                <v-icon>mdi-account-music</v-icon>
              </v-list-item-avatar>

              <v-list-item-avatar v-else class="ml-0 mr-2">
                <v-img :src="$store.getters.getResourceBaseUrl + 'image/?resourceId=' + artist.resourceId" alt="alt" @error="imageError(artist.id)"></v-img>
              </v-list-item-avatar>

              <v-list-item-content class="py-0">
                <v-list-item-title v-text="artist.name"></v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{albumsCountString(artist) + ', ' + albumSongsCountString(artist)}}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon right>mdi-chevron-right</v-icon>
              </v-list-item-action>

            </v-list-item>

          </v-list-item-group>

        </v-list>

      </v-col>

    </v-row>

    <v-row>
      <v-col>
        <v-pagination circle
                      v-model="pagination.page"
                      @next="nextPage"
                      @previous="prevPage"
                      @input="selectPage"
                      :total-visible="5"
                      :length="pagination.totalPages" ></v-pagination>
      </v-col>
    </v-row>

  </div>


</template>

<script>

import api from "@/http/playqdAPI"

export default {
  name: 'ArtistsView',
  components: {

  },
  data() {
    return {
      selectedSortItemIdx: null,
      artistsWithImageNotFound: [],
      artistNameQuery: null,
      artists: [],
      sorting: {
        types: [
          {id: 'NAME',            idx: 0, name: 'By Name',         direction: 'ASC',  icon: 'mdi-sort-alphabetical-ascending'},
          {id: 'RECENTLY_PLAYED', idx: 1, name: 'Recently Played', direction: 'DESC', icon: 'mdi-sort-clock-ascending-outline'},
          {id: 'MOST_PLAYED',     idx: 2, name: 'Most Played',     direction: 'DESC', icon: 'mdi-sort-ascending'},
          {id: 'ALBUM_COUNT',     idx: 3, name: 'Total Albums',    direction: 'DESC', icon: 'mdi-folder-music-outline'},
          {id: 'SONG_COUNT',      idx: 4, name: 'Total Songs',     direction: 'DESC', icon: 'mdi-music-box-multiple-outline'}
        ]
      },
      pagination: {
        page: 0,
        pageSize: 9,
        totalElements: 0,
        totalPages: 0
      },
      selectedSortType: {},
      defaultPageRequest: {},
    }
  },
  mounted() {
    this.selectedSortType = this.sorting.types[0];
    this.defaultPageRequest = { page: 0, sort: this.sorting.types[0] };
    this.findArtists(this.defaultPageRequest);
  },
  methods: {
    findArtists(pageRequest) {
      api.getArtists(pageRequest).then(response => {
        this.artists = response.data.artists;
        this.pagination = { page: response.data.page + 1, pageSize: response.data.pageSize, totalElements: response.data.totalElements, totalPages: response.data.totalPages };
      });
    },
    findArtistsByName() {
      if (this.artistNameQuery && this.artistNameQuery.length > 0) {
        this.selectedSortType = this.sorting.types[0];
        this.findArtists({ page: 1, sort: this.selectedSortType, name: this.artistNameQuery });
        this.artistNameQueryApplied = this.artistNameQuery;
      }
    },
    clearInput() {
      this.artistNameQuery = null;
      this.findArtists(this.defaultPageRequest);
    },
    sortArtists(sortType) {
      this.selectedSortType = sortType;
      this.findArtists({ page: this.pagination.page, sort: sortType });
    },
    albumsCountString(artist) {
      return artist.albumCount > 1 ? artist.albumCount + ' albums' : artist.albumCount + ' album';
    },
    albumSongsCountString(artist) {
      return artist.songCount > 1 ? artist.songCount + ' songs' : artist.songCount + ' song';
    },
    nextPage() {
      this.findArtists({ page: this.pagination.page, sort: this.selectedSortType, name: this.artistNameQuery });
    },
    prevPage() {
      console.log("prev page: " + this.pagination.page)
      this.findArtists({ page: this.pagination.page, sort: this.selectedSortType, name: this.artistNameQuery });
    },
    selectPage(page) {
      this.findArtists({ page: page, sort: this.selectedSortType, name: this.artistNameQuery });
    },
    imageError(artistId) {
      this.artistsWithImageNotFound.push(artistId);
    }
  }
}
</script>