import {HTTP_CLIENT} from "@/http/axios-config";

export default {

    // READ QUERIES

    getArtists() {
        return HTTP_CLIENT.get('/library/artists/')
    },

    getArtistImageSrc(artistId) {
        return HTTP_CLIENT.get('/library/artists/' + artistId + '/image/src')
    },

    getAlbumImageSrc(albumId) {
        return HTTP_CLIENT.get('/library/albums/' + albumId + '/image/src')
    },

    getGenres() {
        return HTTP_CLIENT.get('/library/genres/');
    },

    getArtistAlbums(artistId) {
        return HTTP_CLIENT.get('/library/albums/?artistId=' + artistId);
    },

    getAlbums(params) {
        return HTTP_CLIENT.get('/library/albums/' + params);
    },

    getGenreAlbums(genre) {
        return HTTP_CLIENT.get('/library/albums/?genre=' + genre);
    },

    getSongsFiltered(pageSize, filterType) {
        return HTTP_CLIENT.get('/library/songs/?pageSize=' + pageSize + '&filter=' + filterType);
    },

    getAlbumSongs(albumId) {
        return HTTP_CLIENT.get('/library/songs/album/' + albumId);
    },

    getSong(songId) {
        return HTTP_CLIENT.get('/library/songs/' + songId);
    },

    // MODIFY QUERIES

    updateArtist(data) {
        return HTTP_CLIENT.put('/library/artists/', data);
    },

    updateAlbum(data) {
        return HTTP_CLIENT.put('/library/albums', data);
    },

    setSongFavoriteStatus(songId) {
        return HTTP_CLIENT.post('/library/songs/' + songId);
    },

    updateSong(data) {
        return HTTP_CLIENT.put('/library/songs/', data);
    },

    updateSongHistory(songId) {
        return HTTP_CLIENT.put('/library/history/' + songId);
    }

}