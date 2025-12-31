<<<<<<< HEAD
// backend.js
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Serve GUI
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "GUI.html"));
});

// API endpoint
app.post("/api/youtube-search", async (req, res) => {
    try {
        const filters = req.body;
        const creators = await fetchFilteredYouTubeCreators(filters);
        res.json({ creators });
    } catch (err) {
        console.error("API ERROR:", err);
        res.status(500).json({ error: "YouTube API request failed" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});

// --------------------------------------------------
// YouTube API v3 – Channel Search + Stats
// --------------------------------------------------
async function fetchFilteredYouTubeCreators(filters = {}) {
    const query = filters.query || "beauty skincare";
    const maxResults = 10;

    // 1. Search for channels
    const searchUrl =
        "https://www.googleapis.com/youtube/v3/search?" +
        new URLSearchParams({
            part: "snippet",
            type: "channel",
            q: query,
            maxResults: maxResults,
            key: process.env.YT_API_KEY
        });

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    // Safety check
    if (!searchData.items || searchData.items.length === 0) {
        console.log("No channels found for query:", query);
        return [];
    }

    const channelIds = searchData.items
        .map(item => item.id.channelId)
        .filter(Boolean);

    if (channelIds.length === 0) {
        console.log("No valid channel IDs found");
        return [];
    }

    // 2. Fetch channel statistics
    const statsUrl =
        "https://www.googleapis.com/youtube/v3/channels?" +
        new URLSearchParams({
            part: "snippet,statistics",
            id: channelIds.join(","),
            key: process.env.YT_API_KEY
        });

    const statsRes = await fetch(statsUrl);
    const statsData = await statsRes.json();

    if (!statsData.items) {
        console.log("No stats returned");
        return [];
    }

    // 3. Apply filters
    const filtered = statsData.items.filter(channel => {
        const subs = Number(channel.statistics.subscriberCount || 0);
        const views = Number(channel.statistics.viewCount || 0);
        const videos = Number(channel.statistics.videoCount || 0);

        return (
            subs >= (filters.minSubs || 0) &&
            subs <= (filters.maxSubs || Infinity) &&
            views >= (filters.minViews || 0) &&
            videos >= (filters.minVideos || 0)
        );
    });

    // 4. Return clean result
    return filtered.map(c => ({
        id: c.id,
        name: c.snippet.title,
        description: c.snippet.description,
        subscribers: c.statistics.subscriberCount,
        views: c.statistics.viewCount,
        videos: c.statistics.videoCount,
        thumbnail:
            c.snippet.thumbnails.high?.url ||
            c.snippet.thumbnails.default?.url
    }));
=======
// backend.js
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Serve GUI
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "GUI.html"));
});

// API endpoint
app.post("/api/youtube-search", async (req, res) => {
    try {
        const filters = req.body;
        const creators = await fetchFilteredYouTubeCreators(filters);
        res.json({ creators });
    } catch (err) {
        console.error("API ERROR:", err);
        res.status(500).json({ error: "YouTube API request failed" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});

// --------------------------------------------------
// YouTube API v3 – Channel Search + Stats
// --------------------------------------------------
async function fetchFilteredYouTubeCreators(filters = {}) {
    const query = filters.query || "beauty skincare";
    const maxResults = 10;

    // 1. Search for channels
    const searchUrl =
        "https://www.googleapis.com/youtube/v3/search?" +
        new URLSearchParams({
            part: "snippet",
            type: "channel",
            q: query,
            maxResults: maxResults,
            key: process.env.YT_API_KEY
        });

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    // Safety check
    if (!searchData.items || searchData.items.length === 0) {
        console.log("No channels found for query:", query);
        return [];
    }

    const channelIds = searchData.items
        .map(item => item.id.channelId)
        .filter(Boolean);

    if (channelIds.length === 0) {
        console.log("No valid channel IDs found");
        return [];
    }

    // 2. Fetch channel statistics
    const statsUrl =
        "https://www.googleapis.com/youtube/v3/channels?" +
        new URLSearchParams({
            part: "snippet,statistics",
            id: channelIds.join(","),
            key: process.env.YT_API_KEY
        });

    const statsRes = await fetch(statsUrl);
    const statsData = await statsRes.json();

    if (!statsData.items) {
        console.log("No stats returned");
        return [];
    }

    // 3. Apply filters
    const filtered = statsData.items.filter(channel => {
        const subs = Number(channel.statistics.subscriberCount || 0);
        const views = Number(channel.statistics.viewCount || 0);
        const videos = Number(channel.statistics.videoCount || 0);

        return (
            subs >= (filters.minSubs || 0) &&
            subs <= (filters.maxSubs || Infinity) &&
            views >= (filters.minViews || 0) &&
            videos >= (filters.minVideos || 0)
        );
    });

    // 4. Return clean result
    return filtered.map(c => ({
        id: c.id,
        name: c.snippet.title,
        description: c.snippet.description,
        subscribers: c.statistics.subscriberCount,
        views: c.statistics.viewCount,
        videos: c.statistics.videoCount,
        thumbnail:
            c.snippet.thumbnails.high?.url ||
            c.snippet.thumbnails.default?.url
    }));
>>>>>>> 57ddc17 (Initial commit)
}