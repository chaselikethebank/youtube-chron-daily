const fs = require('fs');
const axios = require('axios');
require('dotenv').config();



const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID = "PLgE8B1SdCTDvc8Ogp6Lced5yCf7x9-JJB";

async function fetchPlaylistVideos() {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
            params: {
                part: 'snippet',
                maxResults: 10,
                playlistId: PLAYLIST_ID,
                key: YOUTUBE_API_KEY
            }
        });
        return response.data.items;
    } catch (error) {
        console.error("Error fetching playlist videos:", error.response ? error.response.data : error.message);
        return null;
    }
}

async function writeDataToFile(data) {
    try {
        await fs.promises.writeFile('youtube-playlist.json', JSON.stringify(data, null, 2));
        console.log('Data written to youtube-playlist.json successfully!');
    } catch (error) {
        console.error("Error writing data to file:", error);
    }
}

async function fetchDataAndWriteToFile() {
    const playlistVideos = await fetchPlaylistVideos();
    if (playlistVideos) {
        await writeDataToFile(playlistVideos);
    }
}

async function fetchAndWriteDataPeriodically() {
    await fetchDataAndWriteToFile();  

    setTimeout(async () => {
        await fetchAndWriteDataPeriodically();
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
}

fetchAndWriteDataPeriodically();
