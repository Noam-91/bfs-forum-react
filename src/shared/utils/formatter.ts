export function getTimeAgo(createdAt: Date | string): string {
    const createdDate = new Date(createdAt);
    const now = new Date();

    const seconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

    let interval = seconds / 31536000; // seconds in a year
    if (interval > 1) {
        return Math.floor(interval) + (Math.floor(interval) === 1 ? " year ago" : " years ago");
    }
    interval = seconds / 2592000; // seconds in a month (approx)
    if (interval > 1) {
        return Math.floor(interval) + (Math.floor(interval) === 1 ? " month ago" : " months ago");
    }
    interval = seconds / 86400; // seconds in a day
    if (interval > 1) {
        return Math.floor(interval) + (Math.floor(interval) === 1 ? " day ago" : " days ago");
    }
    interval = seconds / 3600; // seconds in an hour
    if (interval > 1) {
        return Math.floor(interval) + (Math.floor(interval) === 1 ? " hour ago" : " hours ago");
    }
    interval = seconds / 60; // seconds in a minute
    if (interval > 1) {
        return Math.floor(interval) + (Math.floor(interval) === 1 ? " minute ago" : " minutes ago");
    }
    return "just now";
}