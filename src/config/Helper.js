export function timeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp); // Convert backend timestamp to Date
    const secondsAgo = Math.floor((now - past) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        // { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(secondsAgo / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }

    return "just now";
}

// Example Usage
const isoTimestamp = "2024-12-05T14:00:00Z"; // ISO 8601 timestamp from backend
const unixTimestampMs = 1707165600000; // Unix timestamp in milliseconds
const unixTimestampSec = 1707165600; // Unix timestamp in seconds

console.log(timeAgo(isoTimestamp)); // "1 day ago" (depending on current time)
console.log(timeAgo(unixTimestampMs)); // "x time ago"
console.log(timeAgo(unixTimestampSec * 1000)); // Convert seconds to milliseconds
