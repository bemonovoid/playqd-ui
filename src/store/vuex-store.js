import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loginSuccess: false,
        authToken: null,
        audio: {
            isPlaying: false,
            loading: false,
            volume: 0.5,
            currentTime: 0,
            currentTimeAsInt: 0,
            duration: 0.1
        },
        playlist: {
            id: null,
            shuffle: false,
            repeat: 'none',
            currentSong: null,
            currentSongIdx: -1,
            nowPlaying: null,
            songs: [],
            queue: []
        },
        miniPlayer: {
            show: true
        }
    },
    getters: {
        getResourceBaseUrl: (state) => {
            return process.env.VUE_APP_BASE_URL + '/resource/';
        },
        isLoggedIn: (state) => {
            return state.loginSuccess;
        },
        getCurrentSongDurationInMinutesAndSeconds: (state) => {
            let seconds = state.audio.duration;
            return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
        },
        /**
         * @deprecated
         */
        audioIsPlaying: (state) => {
            return state.audio.isPlaying;
        }
    },
    mutations: {
        setUserAuthToken: (state, payload) => {
          state.loginSuccess = true;
          state.authToken = payload;
        },
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
        setAudioIsLoading: (state, payload) => {
            state.audio.loading = payload;
        },
        setAudioIsPlaying: (state, payload) => {
            state.audio.isPlaying = payload;
        },
        setAudioVolume: (state, payload) => {
            state.audio.volume = payload;
        },
        setPlaylist: (state, payload) => {
            state.playlist.id = payload.playlistId;
            state.playlist.nowPlaying = payload.nowPlaying;
            state.playlist.songs = payload.songs;
            state.playlist.queue = payload.songs.slice();
        },
        setPlaylistQueue: (state, payload) => {
            state.playlist.nowPlaying = payload.nowPlaying;
            state.playlist.queue = payload.queue;
        },
        setShuffle: (state, payload) => {
            state.playlist.shuffleSelected = [];
            state.playlist.shuffle = payload;
        },
        setRepeat: (state, payload) => {
            state.playlist.repeat = payload;
        },
        setNowPlayingSong: (state, payload) => {
            state.playlist.nowPlaying = payload;
        },
        setPlaylistEnded: (state) => {
            state.playlist.nowPlaying = null;
            state.playlist.songs = [];
            state.playlist.queue = [];
        },
        /**
         * @deprecated
         */
        updateCurrentSong: (state, payload) => {
            state.playlist.currentSong = payload;
        },
        setCurrentSongFavoriteStatus: (state) => {
            state.playlist.currentSong.favorite = !state.playlist.currentSong.favorite;
        },
        setShowMiniPlayer: (state, payload) => {
            state.miniPlayer.show = payload;
        },
        /**
         * @deprecated
         */
        setCurrentSongToPrev: (state) => {
            if (state.playlist.currentSongIdx - 1 >= 0) {
                let prevSong = state.playlist.songs[--state.playlist.currentSongIdx];
                state.playlist.currentSong = prevSong;
            }
        },
        /**
         * @deprecated
         */
        setCurrentSongToNext: (state) => {
            let nextSong = null;
            if (state.playlist.currentSongIdx + 1 < state.playlist.songs.length) {
                nextSong = state.playlist.songs[++state.playlist.currentSongIdx];
            } else if (state.playlist.repeat === 'all') {
                nextSong = state.playlist.songs[0];
            } else {
                return;
            }
            state.playlist.currentSong = nextSong;
        }
    }
});