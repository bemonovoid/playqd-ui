export default {
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