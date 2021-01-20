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
            return HTTP_CLIENT.defaults.baseURL + "/artwork/open/";
        },
        getCurrentSongArtworkSrc: (state, getters) => {
            if (state.playlist.currentSong) {
                return getters.getArtWorkBaseUrl + '?albumId=' + state.playlist.currentSong.album.id;
            }
            return null;
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
        setArtists: (state, payload) => {
            state.artists = payload;
        },
        setPlaylist: (state, payload) => {
            state.playlist.id = payload.playlistId;
            state.playlist.shuffle = payload.shuffle;
            let songs = Array.from(payload.songs)
            if (state.playlist.shuffle) {
                shuffleArray(songs);
                state.playlist.currentSong = songs[0];
            } else {
                state.playlist.currentSong = songs.filter((s, i) => s.id === payload.startFromSongId)[0];
            }
            state.playlist.songs = songs;
        },
        setCurrentSongToId: (state, payload) => {
            state.playlist.currentSong = state.playlist.songs.filter((s) => s.id === payload)[0];
        },
        setCurrentSongToPrev: (state) => {
            let songItem = state.playlist.songs
                .map((song, i) => {return {id: song.id, idx: i}})
                .filter((sItem) => sItem.id === state.playlist.currentSong.id)[0];
            state.playlist.currentSong =  state.playlist.songs[songItem.idx - 1];
        },
        setCurrentSongToNext: (state) => {
            let songItem = state.playlist.songs
                .map((song, i) => {return {id: song.id, idx: i}})
                .filter((sItem) => sItem.id === state.playlist.currentSong.id)[0];
            state.playlist.currentSong = state.playlist.songs[songItem.idx + 1];
        },
        setAudioIsPlaying: (state, payload) => {
            state.audio.isPlaying = payload;
        },
        setAudioVolume: (state, payload) => {
            state.audio.volume = payload;
        }
    }
});