import Vue from 'vue'
import Vuex from 'vuex'
import {HTTP_CLIENT} from "@/http/axios-config";

Vue.use(Vuex)

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export default new Vuex.Store({
    state: {
        audio: {
            isPlaying: false,
            volume: 0.5,
            currentTime: 0,
            currentTimeAsInt: 0,
            duration: 0
        },
        artists: [],
        artWorkBaseUrl: HTTP_CLIENT.defaults.baseURL + "/artwork/open/?albumId=",
        artwork: {
            ofCurrentSong: '',
            ofOpenedAlbum: ''
        },
        playlist: {
            id: null,
            shuffle: false,
            loopAll: false,
            loopCurrent:false,
            currentSong: null,
            songs: []
        }
    },
    getters: {
        getArtists: (state) => {
            return state.artists;
        },
        getArtWorkBaseUrl: (state) => {
            return state.artWorkBaseUrl;
        },
        hasNextSong: (state) => {
            let songItem = state.playlist.songs
                .map((song, i) => {return {id: song.id, idx: i}})
                .filter((sItem) => sItem.id === state.playlist.currentSong.id)[0];
            return songItem.idx + 1 < state.playlist.songs.length;
        },
        hasPrevSong: (state) => {
            let songItem = state.playlist.songs
                .map((song, i) => {return {id: song.id, idx: i}})
                .filter((sItem) => sItem.id === state.playlist.currentSong.id)[0];
            return songItem.idx - 1 >= 0;
        },
        getCurrentSongDurationInMinutesAndSeconds: (state) => {
            let seconds = state.audio.duration;
            return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
        },
        audioIsPlaying: (state) => {
            return state.audio.isPlaying;
        }
    },
    mutations: {
        setAudioCurrentTime: (state, payload) => {
            state.audio.currentTime = payload;
            state.audio.currentTimeAsInt = parseInt(payload, 10);
        },
        setAudioProperties: (state, payload) => {
            state.audio.paused = payload.paused;
            state.audio.volume = payload.volume;
            state.audio.currentTime = payload.currentTime;
            state.audio.currentTimeAsInt = parseInt(payload.currentTime, 10);
            state.audio.duration = payload.duration;
        },
        setAudioIsPlaying: (state, payload) => {
            state.audio.isPlaying = payload;
        },
        setAudioVolume: (state, payload) => {
            state.audio.volume = payload;
        },
        setArtists: (state, payload) => {
            state.artists = payload;
        },
        setArtworkOfCurrentSong: (state, payload) => {
            state.artwork.ofCurrentSong = payload;
        },
        setArtworkOfOpenedAlbum: (state, payload) => {
            if (state.playlist.currentSong && state.playlist.currentSong.album.id === payload.albumId) {
                state.artwork.ofCurrentSong = payload.src;
            }
            state.artwork.ofOpenedAlbum = payload.src;
        },
        setPlaylist: (state, payload) => {
            state.playlist.id = payload.playlistId;
            state.playlist.shuffle = payload.shuffle;
            let songs = Array.from(payload.songs)
            if (state.playlist.shuffle) {
                shuffleArray(songs);
                state.playlist.currentSong = songs[0];
            } else {
                state.playlist.currentSong = songs.filter((s, i) => s.id === payload.startSong.id)[0];
            }
            state.playlist.songs = songs;
            state.artwork.ofCurrentSong = state.artWorkBaseUrl + state.playlist.currentSong.album.id;
        },
        setCurrentSongToPrev: (state) => {
            let songItem = state.playlist.songs
                .map((song, i) => {return {id: song.id, idx: i}})
                .filter((sItem) => sItem.id === state.playlist.currentSong.id)[0];
            let prevSong = state.playlist.songs[songItem.idx - 1];
            if (state.playlist.currentSong.album.id !== prevSong.album.id) {
                state.artwork.ofCurrentSong = state.artWorkBaseUrl + state.playlist.currentSong.album.id;
            }
            state.playlist.currentSong = prevSong;
        },
        setCurrentSongToNext: (state) => {
            let songItem = state.playlist.songs
                .map((song, i) => {return {id: song.id, idx: i}})
                .filter((sItem) => sItem.id === state.playlist.currentSong.id)[0];
            let nextSong = state.playlist.songs[songItem.idx + 1];
            if (state.playlist.currentSong.album.id !== nextSong.album.id) {
                state.artwork.ofCurrentSong = state.artWorkBaseUrl + state.playlist.currentSong.album.id;
            }
            state.playlist.currentSong = nextSong;
        },
        setCurrentSong: (state, payload) => {
            if (!state.playlist.currentSong) {
                state.artwork.ofCurrentSong = state.artWorkBaseUrl + payload.album.id;
            }
            state.playlist.currentSong = payload;
        }
    }
});