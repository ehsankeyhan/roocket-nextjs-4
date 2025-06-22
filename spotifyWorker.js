const axios = require("axios");

async function callAPI() {
  try {
    const response = await axios.get("http://23.162.200.36:3000/api/spotifydown");
    console.log("API Response:", response.data?.data?.createdAt);
  } catch (error) {
    console.error("Error calling API:", error.message);
  }
}

// Call the API immediately, then every 20 minutes
callAPI();
setInterval(callAPI, 10 * 60 * 1000);
