export default {
    getRandomIdx(arrayLength) {
        return Math.floor(Math.random() * arrayLength);
    },
    hasNextSong(playlist) {
        if (!playlist.nowPlaying) {
            return false;
        }
        if (playlist.queue.length === 1) {
            if (playlist.repeat === 'none') {
                return false;
            } else {
                playlist.queue = playlist.songs.slice();
            }
        }
        return true;
    },
    getNextSong(playlist) {
        if (playlist.shuffle) {
            return this.getNextShuffled(playlist);
        }
        let sng = playlist.queue.shift();
        console.log(sng.name);
        return playlist.queue[0];
    },
    getNextShuffled(playlist) {
        let shuffledSongIdx = this.getRandomIdx(playlist.queue.length);
        return playlist.queue.splice(shuffledSongIdx, 1);
    },
    hasPrevSong(playlist) {
        if (!playlist.nowPlaying || playlist.shuffle) {
            return false;
        }
        let nowPlayingIdx = playlist.songs.findIndex(s => s.id === playlist.nowPlaying.id);
        return nowPlayingIdx - 1 >= 0;
    },
    getPrevSong(playlist) {
        let nowPlayingIdx = playlist.songs.findIndex(s => s.id === playlist.nowPlaying.id);
        let prevSong = playlist.songs[nowPlayingIdx - 1];
        playlist.queue.unshift(prevSong);
        return prevSong;
    },
    shufflePlaylist(songs) {
        for (let i = songs.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = songs[i];
            songs[i] = songs[j];
            songs[j] = temp;
        }
    },
    secondsToHHmmss(seconds) {
        let hrs = ~~(seconds / 3600);
        let mins = ~~((seconds % 3600) / 60);
        let secs = ~~seconds % 60;

        let res = "";
        if (hrs > 0) {
            res += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
        res += "" + mins + ":" + (secs < 10 ? "0" : "");
        res += "" + secs;
        return res;
    },
    secondsToHHmmText(seconds) {
        let hrs = ~~(seconds / 3600);
        let mins = ~~((seconds % 3600) / 60);
        let minutesText = mins > 1 ? "minutes" : "minute";
        let res = '' + mins + ' ' + minutesText;
        if (hrs > 0) {
            let hoursText = hrs > 1 ? 'hours' : 'hour';
            res =  hrs + ' ' + hoursText + ' ' + res;
        }
        return res;
    }
}