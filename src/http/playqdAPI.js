import axios from 'axios';
import router from "@/router";

const HTTP_CLIENT = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL
});

export default {

    getBaseUrl() { return HTTP_CLIENT.defaults.baseURL },

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

    updateAlbum(data) { return this.executePut('/library/albums', data) },

    setSongFavoriteStatus(songId) { return this.executePost('/library/songs/' + songId) },

    updateSong(data) { return this.executePut('/library/songs/', data) },

    updateSongHistory(songId) { return this.executePut('/library/history/' + songId) },

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
    }
}