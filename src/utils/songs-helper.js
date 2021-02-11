class SongsHelper {
    shufflePlaylist(songs) {
        for (let i = songs.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = songs[i];
            songs[i] = songs[j];
            songs[j] = temp;
        }
    };
    convertSecondsToMinutesAndSeconds(seconds) {
        return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
    }
}

export const SONG_HELPER = new SongsHelper();