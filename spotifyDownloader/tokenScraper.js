const express = require("express");
const { connect } = require("puppeteer-real-browser");
const axios = require("axios");

const app = express();
const PORT = 4001;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchSpotifyToken() {
  let browser;
  try {
    console.log("Connecting to Puppeteer Real Browser...");
    const { page, browser: connectedBrowser } = await connect({
      args: [
        "--start-maximized",
        "--disable-blink-features=AutomationControlled",
        "--disable-infobars",
        "--disable-dev-shm-usage",
        "--disable-extensions",
      ],
      turnstile: true,
      headless: false,
      connectOption: { defaultViewport: null },
      plugins: [require("puppeteer-extra-plugin-stealth")()],
    });
    browser = connectedBrowser;
    
    // await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    
    console.log("Navigating to Spotidownloader...");
    await page.goto("https://spotisongdownloader.to/", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: 'before-Url1.png' });


    console.log("Filling in Spotify track URL...");
    await page.waitForSelector("input", { visible: true });
    await page.type("input", "https://open.spotify.com/track/04UfII2w4nrqX34USAzkGw");
    await sleep(3000);
    
    console.log("Clicking Download button...");
    // await page.realClick("aria/download");
    await sleep(3000);
    
    console.log("Intercepting requests...");
    await page.setRequestInterception(true);
    let token = null;
    let cookie = null;
    
    page.on("request", (request) => {
      const url = request.url();
      
      if (url.startsWith("https://spotisongdownloader.to/api/composer/spotify/")) {
        const headers = request.headers();                
        if(headers.cookie){
          cookie = headers.cookie
          console.log(cookie);
        }
        token = url.split('/').pop().replace('.php', '')
      }
      request.continue();
    });
    
    console.log("Clicking second Download button...");
    await sleep(3000);

    await page.realClick("aria/Generate Download Link");
    await sleep(1000);

    console.log("Clicking Generate Download Link...");


    console.log("Filling in file format...");

    await page.realClick("aria/[role='combobox']");
    await page.select("aria/[role='combobox']","m4a");

    
    console.log("Waiting for token extraction...");
    await sleep(5000);
    await page.screenshot({ path: 'before-Url2.png' });

    if (!token) throw new Error("Token not found");
    
    console.log("Sending token to Cassett API...");
    const response = await axios.get(`https://cassett.app/api/admin/updateSpotURL?address=${token}&cookie=${cookie}`);
    console.log("Cassett API Response:", response.data);
    return { success: true, token,cookie };
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: error.message };
  } finally {
    if (browser) await browser.close();
    console.log("Browser closed");
  }
}

app.get("/api/spotifydown", async (req, res) => {
  const result = await fetchSpotifyToken();
  res.json(result);
});

// Periodically call the API every 10 minutes
async function callAPI() {
  try {
    const response = await axios.get("http://localhost:4001/api/spotifydown");
    console.log("API Response:");
  } catch (error) {
    console.error("Error calling API:", error.message);
  }
}
callAPI();
setInterval(callAPI, 30 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});