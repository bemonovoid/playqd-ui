import Vue from 'vue'
import Vuex from 'vuex'
import {HTTP_CLIENT} from "@/http/axios-config";

Vue.use(Vuex)

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
            repeat: 'none',
            loopAll: false,
            loopCurrent:false,
            currentSong: null,
            currentSongIdx: -1,
            songs: []
        },
        miniPlayer: {
            show: true
        }
    },
    getters: {
        getArtists: (state) => {
            return state.artists;
        },
        getArtWorkBaseUrl: (state) => {
            return state.artWorkBaseUrl;
        },
        repeatAll: (state) => {
            return state.playlist.repeat === 'all';
        },
        hasNextSong: (state, getters) => {
           return getters.repeatAll || state.playlist.currentSongIdx + 1 < state.playlist.songs.length;
        },
        hasPrevSong: (state) => {
            return state.playlist.currentSongIdx - 1 >= 0;
        },
        getNextSong: (state, getters) => {
            if (getters.hasNextSong) {
                if (state.playlist.currentSongIdx + 1 === state.playlist.songs.length && getters.repeatAll) {
                    return state.playlist.songs[0];
                }
                return state.playlist.songs[state.playlist.currentSongIdx + 1];
            }
            return null;
        },
        getPrevSong: (state, getters) => {
            if (getters.hasPrevSong) {
                return state.playlist.songs[state.playlist.currentSongIdx - 1]
            }
            return null;
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
            state.playlist.currentSong = payload.songs[payload.startSongIdx];
            state.playlist.currentSongIdx = payload.startSongIdx;
            state.playlist.songs = payload.songs;
            state.artwork.ofCurrentSong = state.artWorkBaseUrl + state.playlist.currentSong.album.id;
        },
        setCurrentSongToPrev: (state) => {
            if (state.playlist.currentSongIdx - 1 >= 0) {
                let prevSong = state.playlist.songs[--state.playlist.currentSongIdx];
                if (prevSong.album.id !== state.playlist.currentSong.album.id) {
                    state.artwork.ofCurrentSong = state.artWorkBaseUrl + state.playlist.currentSong.album.id;
                }
                state.playlist.currentSong = prevSong;
            }
        },
        setCurrentSongToNext: (state) => {
            let nextSong = null;
            if (state.playlist.currentSongIdx + 1 < state.playlist.songs.length) {
                nextSong = state.playlist.songs[++state.playlist.currentSongIdx];
            } else if (state.playlist.repeat === 'all') {
                nextSong = state.playlist.songs[0];
            } else {
                return;
            }
            if (nextSong.album.id !== state.playlist.currentSong.album.id) {
                state.artwork.ofCurrentSong = state.artWorkBaseUrl + state.playlist.currentSong.album.id;
            }
            state.playlist.currentSong = nextSong;
        },
        setCurrentSong: (state, payload) => {
            let song = state.playlist.songs[payload];
            if (state.playlist.currentSong) {
                if (song.album.id !== state.playlist.currentSong.album.id) {
                    state.artwork.ofCurrentSong = state.artWorkBaseUrl + song.album.id;
                }
            } else {
                state.artwork.ofCurrentSong = state.artWorkBaseUrl + song.album.id;
            }
            state.playlist.currentSong = song;
            state.playlist.currentSongIdx = payload;
            if (state.playlist.songs.length === 0) {
                state.playlist.songs[0] = state.playlist.currentSong;
            }
        },
        setCurrentSongFavoriteStatus: (state) => {
            state.playlist.currentSong.favorite = !state.playlist.currentSong.favorite;
        },
        setShowMiniPlayer: (state, payload) => {
            state.miniPlayer.show = payload;
        },
        setRepeatMode: (state, payload) => {
            state.playlist.repeat = payload;
        }
    }
});