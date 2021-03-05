import axios from 'axios';

import router from "@/router";

const HTTP_CLIENT = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL
});

export default {

    getBaseUrl() { return HTTP_CLIENT.defaults.baseURL },

    getArtistsApiUrl() { return this.getBaseUrl() + '/library/artists/' },

    getAlbumsApiUrl() { return this.getBaseUrl() + '/library/albums/' },

    getSongSrcUrl(songId) { return this.getBaseUrl() + '/audio/open/?songId=' + songId },

    getArtists() { return this.executeGet('/library/artists/') },

    getArtistImageSrc(artistId) { return this.executeGet('/library/artists/' + artistId + '/image/src') },

    getAlbumImageSrc(albumId) { return this.executeGet('/library/albums/' + albumId + '/image/src') },

    getGenres() { return this.executeGet('/library/genres/') },

    getArtistAlbums(artistId) { return this.executeGet('/library/albums/?artistId=' + artistId) },

    getAlbums(params) { return this.executeGet('/library/albums/' + params) },

    getGenreAlbums(genre) { return this.executeGet('/library/albums/?genre=' + genre) },

    getSongsFiltered(pageSize, filterType) { return this.executeGet('/library/songs/?pageSize=' + pageSize + '&filter=' + filterType) },

    getAlbumSongs(albumId) { return this.executeGet('/library/songs/album/' + albumId) },

    getSong(songId) { return this.executeGet('/library/songs/' + songId) },

    updateArtist(data) { return this.executePut('/library/artists/', data) },

    updateAlbumProperties(data) { return this.executePut('/library/albums', data) },

    updateAlbumPreferences(data) { return this.executePut('/library/albums/preferences', data) },

    setSongFavoriteStatus(song) {
        if (song.playbackInfo) {
            return song.playbackInfo.favorite ? this.unsetFavorite(song.id) : this.setFavorite(song.id)
        } else {
            return this.setFavorite(song.id);
        }
    },

    setFavorite(songId) { return this.executePut('/library/songs/' + songId + '/favorite') },

    unsetFavorite(songId) { return this.executeDelete('/library/songs/' + songId + '/favorite') },

    updateSong(data) { return this.executePut('/library/songs/', data) },

    updatePlayedSongCount(songId) { return this.executePut('/library/songs/' + songId + '/stats/played') },

    createAccount(data) { return this.executePost('/accounts', data) },

    login(data) {
        return HTTP_CLIENT.post('/accounts/login', {}, {auth: data});
    },

    executeGet(url) {
        return HTTP_CLIENT.get(url).catch(error => {
            if (error.response && error.response.status === 401) {
                router.push({name: 'LoginView'});
            }
        });
    },

    executePut(url, data) {
        return HTTP_CLIENT.put(url, data).catch(error => {
            if (error.response && error.response.status === 401) {
                router.push({name: 'LoginView'});
            }
        });
    },

    executePost(url, data) {
        return HTTP_CLIENT.post(url, data).catch(error => {
            if (error.response && error.response.status === 401) {
                router.push({name: 'LoginView'});
            }
        });
    },

    executeDelete(url) {
        return HTTP_CLIENT.delete(url).catch(error => {
            if (error.response && error.response.status === 401) {
                router.push({name: 'LoginView'});
            }
        });
    }
}