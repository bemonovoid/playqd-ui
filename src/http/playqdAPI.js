import axios from 'axios';

import store from "@/store/vuex-store";
import router from "@/router";

const HTTP_CLIENT = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL
});

export default {

    getBaseUrl() { return HTTP_CLIENT.defaults.baseURL },

    getResourceApiUrl() { return this.getBaseUrl() + '/api/library/resource/' },

    getAlbumsApiUrl() { return this.getBaseUrl() + '/api/library/albums/' },

    getSongSrcUrl(resourceId) { return this.getResourceApiUrl() + 'audio/?resourceId=' + resourceId },

    getArtists() { return this.executeGet('/api/library/artists/') },

    getArtistImageSrc(artistId) { return this.executeGet('/api/library/artists/' + artistId + '/image/src') },

    getAlbumImageSrc(albumId) { return this.executeGet('/api/library/albums/' + albumId + '/image/src') },

    getGenres() { return this.executeGet('/api/library/genres/') },

    getArtistAlbums(artistId) { return this.executeGet('/api/library/albums/?artistId=' + artistId) },

    getAlbums(params) { return this.executeGet('/api/library/albums/' + params) },

    getGenreAlbums(genre) { return this.executeGet('/api/library/albums/?genre=' + genre) },

    getSongsFiltered(pageSize, filterType) { return this.executeGet('/api/library/songs/?pageSize=' + pageSize + '&filter=' + filterType) },

    getAlbumSongs(albumId) { return this.executeGet('/api/library/songs/album/' + albumId) },

    getSong(songId) { return this.executeGet('/api/library/songs/' + songId) },

    updateArtist(data) { return this.executePut('/api/library/artists/', data) },

    updateAlbumProperties(data) { return this.executePut('/api/library/albums', data) },

    updateAlbumPreferences(data) { return this.executePut('/api/library/albums/preferences', data) },

    setSongFavoriteStatus(song) {
        if (song.playbackInfo) {
            return song.playbackInfo.favorite ? this.unsetFavorite(song.id) : this.setFavorite(song.id)
        } else {
            return this.setFavorite(song.id);
        }
    },

    setFavorite(songId) { return this.executePut('/api/library/songs/' + songId + '/favorite') },

    unsetFavorite(songId) { return this.executeDelete('/api/library/songs/' + songId + '/favorite') },

    updateSong(data) { return this.executePut('/api/library/songs/', data) },

    updatePlayedSongCount(songId) { return this.executePut('/api/library/songs/' + songId + '/stats/played') },

    createAccount(data) { return this.executePost('/api/accounts', data) },

    login(data) { return HTTP_CLIENT.post('/login', {}, {auth: data}) },

    executeGet(url) {
        return HTTP_CLIENT.get(url, this.authTokenHeader()).catch(error => {
            this.handlerUnauthorizedResponse(error);
        });
    },

    executePut(url, data) {
        return HTTP_CLIENT.put(url, data, this.authTokenHeader()).catch(error => {
            this.handlerUnauthorizedResponse(error);
        });
    },

    executePost(url, data) {
        return HTTP_CLIENT.post(url, data, this.authTokenHeader()).catch(error => {
            this.handlerUnauthorizedResponse(error);
        });
    },

    executeDelete(url) {
        return HTTP_CLIENT.delete(url, this.authTokenHeader()).catch(error => {
            this.handlerUnauthorizedResponse(error);
        });
    },

    handlerUnauthorizedResponse(error) {
        if (error.response && error.response.status === 401) {
            router.push({name: 'LoginView'});
        }
    },

    authTokenHeader() {
        if (store.state.authToken) {
            return {
                headers: {
                    'Authorization': 'Bearer ' + store.state.authToken
                }
            }
        }
        return null;
    }
}