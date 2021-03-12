<template>

  <div v-if="this.albums.length > 0">

    <v-row>

      <v-col class="px-0 py-0 text-left">
        <v-list-item>

          <div v-if="$route.query.artistId">
            <v-dialog v-if="showArtistImage" max-width="500">
              <template v-slot:activator="{on, attrs}">
                <v-list-item-avatar class="ml-0 mr-2 mb-5" v-on="on" v-bind="attrs">
                  <v-img :src="$store.getters.getResourceBaseUrl + 'image/?resourceId=' + albums[0].artist.resourceId" @error="imageError()"></v-img>
                </v-list-item-avatar>
              </template>
              <v-card align="center" elevation="5">
                <v-img class="white--text align-end" :src="$store.getters.getResourceBaseUrl + 'image?resourceId=' + albums[0].artist.resourceId + '&size=LARGE'">
                  <v-card-title>{{this.albums[0].artist.name}}</v-card-title>
                </v-img>
              </v-card>
            </v-dialog>
          </div>

          <v-list-item-content>
            <v-list-item-title class="display-1">{{this.$route.query.artistId ? this.albums[0].artist.name : this.$route.query.genre}}</v-list-item-title>
            <v-list-item-subtitle>Total {{ (this.$route.query.artistId ? ' artist ' : ' genre ')  + 'albums: ' + this.pagination.totalElements}}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action v-if="$route.query.artistId" class="mx-0">
            <EditArtistView v-on:close="" v-bind:artist-data="albums[0].artist" :artist-image-found.sync="showArtistImage"></EditArtistView>
          </v-list-item-action>

          <v-list-item-action class="mx-0">
            <v-menu offset-y left>

              <template v-slot:activator="{attrs, on}">
                <v-btn fab small icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>

              <v-list dense class="text-left">
                <v-subheader>Sort albums</v-subheader>
                <v-list-item-group color="primary" v-model="selectedSortType.idx">
                  <v-list-item v-for="(sortType, i) in sorting.types" :key="i" @click="sortAlbums(sortType)">
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
        <v-item-group align="left">
          <v-text-field flat dense clearable placeholder="Find album" class="py-0"
                        @keydown.enter="findAlbumsByName()" @keydown.esc="clearInput()"
                        v-model="albumNameQuery"
                        @click:clear="clearInput()"
                        prepend-inner-icon="mdi-text-short"
                        append-outer-icon="mdi-magnify"
                        @click:append-outer="findAlbumsByName()">
          </v-text-field>
        </v-item-group>

      </v-col>
    </v-row>

    <v-row class="justify-space-around">
      <v-col v-for="album in albums" :key="album.id" :cols="6" align="center" md="auto">
        <v-card max-width="200" max-height="300" @click="openAlbum(album)">

          <div v-if="albumsWithoutImage.includes(album.id)">
            <v-img src="@/assets/default-album-cover.png"
                   gradient="to bottom, rgba(0, 0, 0, .1), rgba(0, 0, 0 ,.5)"></v-img>
          </div>
          <div v-else>
            <v-img :src="$store.getters.getResourceBaseUrl + 'image?resourceId=' + album.resourceId"
                   @error="imageError(album.id)"
                   class="white--text align-end">
            </v-img>
          </div>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-card-subtitle
                  class="py-0 text-left text-truncate text-subtitle-2"
                  v-bind="attrs" v-on="on"
                  v-text="album.name">
              </v-card-subtitle>
            </template>
            <span>{{ album.name }}</span>
          </v-tooltip>

          <v-card-subtitle class="py-0 text-left text-truncate text-caption text--disabled" v-text="album.date ? album.date : '----'"></v-card-subtitle>

        </v-card>
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
import EditArtistView from "@/components/library/artists/EditArtistView";

export default {
  name: 'AlbumsView',
  components: {EditArtistView},
  data() {
    return {
      albumNameQuery: null,
      showArtistImage: true,
      albumsWithoutImage: [],
      sorting: {
        types: [
          {id: 'NAME', idx: 0, direction: 'ASC',  name: 'Title',        icon: 'mdi-sort-alphabetical-ascending'},
          {id: 'DATE', idx: 1, direction: 'DESC', name: 'Newest First', icon: 'mdi-sort-clock-ascending-outline'},
          {id: 'DATE', idx: 2, direction: 'ASC',  name: 'Oldest First', icon: 'mdi-sort-ascending'}
        ]
      },
      albums: [],
      pagination: {
        page: 1,
        pageSize: 6,
        totalElements: 0,
        totalPages: 0
      },
      selectedSortType: {},
      defaultPageRequest: {},
    }
  },
  mounted() {
    this.selectedSortType = this.sorting.types[0];
    this.defaultPageRequest = this.createPageRequest(1, this.sorting.types[0]);
    this.findAlbums(this.defaultPageRequest);
  },
  methods: {
    findAlbums(pageRequest) {
      api.getAlbums(pageRequest).then(response => {
        this.albums = response.data.albums;
        this.pagination = { page: response.data.page + 1, pageSize: response.data.pageSize, totalElements: response.data.totalElements, totalPages: response.data.totalPages };
      });
    },
    findAlbumsByName() {
      if (this.albumNameQuery && this.albumNameQuery.length > 0) {
        this.selectedSortType = this.sorting.types[0];
        this.findAlbums(this.createPageRequest(1));
      }
    },
    clearInput() {
      this.albumNameQuery = null;
      this.findAlbums(this.defaultPageRequest);
    },
    sortAlbums(sortType) {
      this.selectedSortType = sortType;
      this.findAlbums(this.createPageRequest(1));
    },
    nextPage() {
      this.findAlbums(this.createPageRequest(this.pagination.page));
    },
    prevPage() {
      this.findAlbums(this.createPageRequest(this.pagination.page));
    },
    selectPage(page) {
      this.findAlbums(this.createPageRequest(page));
    },
    createPageRequest(page, sortType) {
      return { page: page, pageSize: 6, sort: sortType ? sortType : this.selectedSortType, name: this.albumNameQuery, artistId: this.$route.query.artistId, genre: this.$route.query.genre };
    },
    openAlbum(album) {
      this.$router.push({name: 'AlbumSongsView', params:
            {
              albumId: album.id,
              albumData: album,
              albumFrom: this.$route.query.artistId ? 'artist' : 'genre'
            }
      });
    },
    imageError(albumId) {
      if (albumId) {
        this.albumsWithoutImage.push(albumId);
      } else {
        this.showArtistImage = false;
      }
    }
  }
}
</script>