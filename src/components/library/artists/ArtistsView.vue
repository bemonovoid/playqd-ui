<template>

  <div>
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
                  <v-icon color="success">mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>

              <v-list dense class="text-left">
                <v-subheader>Sort artists</v-subheader>
                <v-list-item-group color="primary" v-model="selectedSortType.idx">
                  <v-list-item v-for="(sortType, i) in sorting.types" :key="i" @click="sortArtists(sortType)">
                    <v-list-item-title>{{sortType.name}}</v-list-item-title>
                    <v-list-item-icon>
                      <v-icon color="success" right small>{{sortType.icon}}</v-icon>
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
      <v-col class="py-0 px-0 text-left">
        <v-list-item>
          <v-list-item-content class="py-0">
            <v-text-field flat clearable placeholder="Find in artists"
                          @keydown.enter="findArtistsByName()" @keydown.esc="clearInput()"
                          v-model="artistNameQuery"
                          @click:clear="clearInput()"
                          prepend-inner-icon="mdi-text-short"
                          append-outer-icon="mdi-magnify"
                          @click:append-outer="findArtistsByName()">
            </v-text-field>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="py-0">

        <v-list align="left" class="py-0">

          <v-list-item-group color="primary">

            <v-list-item v-for="(artist, i) in artists" :key="i" class="px-0" :to="{name: 'AlbumsView', query: {artistId: artist.id}}">

              <v-list-item-avatar v-if="artistsWithImageNotFound.includes(artist.id)" class="ml-0 mr-2">
                <v-icon color="success">mdi-account-music</v-icon>
              </v-list-item-avatar>

              <v-list-item-avatar v-else class="ml-0 mr-2">
                <v-img :src="$store.getters.getResourceBaseUrl + 'image/' + artist.id + '?target=ARTIST'" alt="alt" @error="imageError(artist.id)"></v-img>
              </v-list-item-avatar>

              <v-list-item-content class="py-0">
                <v-list-item-title class="success--text" v-text="artist.name"></v-list-item-title>
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
        <v-pagination color="success"
                      v-model="pagination.page"
                      @next="nextPage"
                      @previous="prevPage"
                      @input="selectPage"
                      :total-visible="5"
                      :length="pagination.totalPages">
        </v-pagination>
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
        page: 1,
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
    this.findArtists(this.createPageRequest(this.defaultPageRequest.page, this.defaultPageRequest.sort));
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
        this.findArtists(this.createPageRequest(1));
      }
    },
    clearInput() {
      this.artistNameQuery = null;
      this.findArtists(this.createPageRequest(this.defaultPageRequest.page, this.defaultPageRequest.sort));
    },
    sortArtists(sortType) {
      this.selectedSortType = sortType;
      this.findArtists(this.createPageRequest(1));
    },
    nextPage() {
      this.findArtists(this.createPageRequest(this.pagination.page));
    },
    prevPage() {
      this.findArtists(this.createPageRequest(this.pagination.page));
    },
    selectPage(page) {
      this.findArtists(this.createPageRequest(page));
    },
    createPageRequest(page, sortType) {
      return { page: page, pageSize: 9, sort: sortType ? sortType : this.selectedSortType, name: this.artistNameQuery }
    },
    albumsCountString(artist) {
      return artist.albumCount > 1 ? artist.albumCount + ' albums' : artist.albumCount + ' album';
    },
    albumSongsCountString(artist) {
      return artist.songCount > 1 ? artist.songCount + ' songs' : artist.songCount + ' song';
    },
    imageError(artistId) {
      this.artistsWithImageNotFound.push(artistId);
    }
  }
}
</script>