class Utility {
    static timeSince(date) {
        var seconds = Math.floor((new Date() - new Date(date)) / 1000);
        var interval = seconds / 31536000;

        const fstr = (interval, timeFrame) => {
            if (interval > 2)
                return Math.floor(interval) + ` ${timeFrame}s ago`;
            if (interval > 1)
                return Math.floor(interval) + ` ${timeFrame} ago`;

            return false;
        };

        if (fstr(interval, 'year'))
            return fstr(interval, 'year');

        interval = seconds / 2592000;
        if (fstr(interval, 'month'))
            return fstr(interval, 'month');

        interval = seconds / 86400;
        if (fstr(interval, 'day'))
            return fstr(interval, 'day');

        interval = seconds / 3600;
        if (fstr(interval, 'hour'))
            return fstr(interval, 'hour');

        interval = seconds / 60;
        if (fstr(interval, 'minute'))
            return fstr(interval, 'minute');

        if (seconds > 10)
            return seconds + " seconds ago";

        return "just now";
    }
}

export default Utility;
