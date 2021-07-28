import axios from 'axios';

import store from "@/store/vuex-store";
import router from "@/router";

const HTTP_CLIENT = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL
});

export default {

    getBaseUrl() { return HTTP_CLIENT.defaults.baseURL },

    getResourceApiUrl() { return this.getBaseUrl() + '/resource/' },

    getAlbumsApiUrl() { return this.getBaseUrl() + '/api/library/albums/' },

    getSongSrcUrl(songId) { return this.getResourceApiUrl() + 'audio/' + songId},

    findArtistImages(artistId) { return this.executeGet('/api/library/artists/' + artistId + '/images') },

    getAlbumImageSrc(albumId) { return this.executeGet('/api/library/albums/' + albumId + '/image/src') },

    getAllBasicArtists() { return this.executeGet('/api/library/artists/view/basic') },

    getArtists(pagination, sort, name) {
        let url = '/api/library/artists/' +
            '?page=' + (pagination.page === 0 ? 0 : pagination.page - 1) +
            '&size=' + pagination.pageSize +
            '&sortBy=' + sort.by.toString().toUpperCase() +
            '&direction=' + sort.direction;
        if (name && name.length > 0) {
            url += '&name=' + name;
        }
        return this.executeGet(url);
    },
    getAlbums(pagination, sort, artistId, genre, name) {
        let url = '/api/library/albums/' +
            '?page=' + (pagination.page === 0 ? 0 : pagination.page - 1) +
            '&size=' + pagination.pageSize +
            '&sortBy=' + sort.by.toString().toUpperCase() +
            '&direction=' + sort.direction;
        if (artistId) {
            url += '&artistId=' + artistId;
        }
        if (name && name.length > 0) {
            url += '&name=' + name;
        }
        if (genre && genre.length > 0) {
            url += '&genre=' + genre;
        }
        return this.executeGet(url);
    },

    getGenres(pagination, sort, name) {
        let url = '/api/library/genres/' +
            '?page=' + (pagination.page === 0 ? 0 : pagination.page - 1) +
            '&size=' + pagination.pageSize +
            '&sortBy=' + sort.by.toString().toUpperCase() +
            '&direction=' + sort.direction;
        if (name && name.length > 0) {
            url += '&name=' + pageRequest.name;
        }
        return this.executeGet(url);
    },

    getSongs(pageRequest) {
        let url = '/api/library/songs/' +
            '?page=' + (pageRequest.page === 0 ? 0 : pageRequest.page - 1) + '&size=' + pageRequest.pageSize;
        if (pageRequest.sort) {
            url += '&sortBy=' + pageRequest.sort.id + '&direction=' + pageRequest.sort.direction;
        }
        if (pageRequest.name && pageRequest.name.length > 0) {
            url += '&name=' + pageRequest.name;
        }
        if (pageRequest.albumId) {
            url += '&albumId=' + pageRequest.albumId;
        }
        if (pageRequest.format) {
            url += '&format=' + pageRequest.format;
        }
        return this.executeGet(url);
    },

    getAlbumSongs(albumId, format) {
        let url = '/api/library/songs/album/' + albumId + '/?sortBy=TRACK_ID';
        if (format) {
            url += '&format=' + format;
        }
        return this.executeGet(url);
    },

    getArtistSongs(artistId) { return this.executeGet('/api/library/songs/artist/' + artistId) },

    getAlbumSongsFormats(albumId) { return this.executeGet('/api/library/songs/album/' + albumId + '/formats') },

    getSong(songId) { return this.executeGet('/api/library/songs/' + songId) },

    getLibrarySettings() { return this.executeGet('/api/settings/library') },

    getScanLogs(pageRequest) {
        let page = pageRequest.page === 0 ? 0 : pageRequest.page - 1;
        return this.executeGet('/api/settings/library/scans/?page=' + page + '&size=' + pageRequest.pageSize)
    },

    updateArtistGroup(data) { return this.executePatch('/api/library/artists/group', data) },

    updateArtistDetails(artistId, data) { return this.executePatch('/api/library/artists/' + artistId, data) },

    updateArtistMisc(data) { return this.executePut('/api/library/artists/' + data.id, data) },

    addArtistImages(artistId, data) { return this.executePut('/api/library/artists/' + artistId + '/images', data) },

    moveArtist(data) {return this.executePut('/api/library/artists/moved', data) },

    updateAlbumProperties(data) { return this.executePut('/api/library/albums/' + data.id, data) },

    moveAlbum(data) { return this.executePut('/api/library/albums/moved', data) },

    setSongFavoriteStatus(song) { return song.favorite ? this.unsetFavorite(song.id) : this.setFavorite(song.id) },

    setFavorite(songId) { return this.executePut('/api/library/songs/' + songId + '/favorite') },

    unsetFavorite(songId) { return this.executeDelete('/api/library/songs/' + songId + '/favorite') },

    updateSong(data) { return this.executePut('/api/library/songs/' + data.id, data) },

    moveSong(data) { return this.executePut('/api/library/songs/' + data.songId + '/moved', data) },

    updatePlayedSongCount(songId) { return this.executePut('/api/library/songs/' + songId + '/played') },

    createAccount(data) { return this.executePost('/api/accounts', data) },

    login(data) { return HTTP_CLIENT.post('/login', {}, {auth: data}) },

    saveLibrarySettings(data) { return this.executePut('/api/settings/library', data) },

    rescanLibrary(data) { return this.executePatch('/api/settings/library', data) },

    executeGet(url) {
        return HTTP_CLIENT.get(url, this.authTokenHeader()).catch(error => {
            this.handlerUnauthorizedResponse(error);
        });
    },

    executePatch(url, data) {
        return HTTP_CLIENT.patch(url, data, this.authTokenHeader()).catch(error => {
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