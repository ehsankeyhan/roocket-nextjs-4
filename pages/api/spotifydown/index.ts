import { connect } from 'puppeteer-real-browser';

declare global {
  interface Window {
    turnstile?: {
      getResponse: () => string | null;
    };
  }
}

export {};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  let browser: any;

  try {
    console.log('Connecting to Puppeteer Real Browser...');
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
    
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    
    console.log('Navigating to Spotidownloader...');
    await page.goto('https://spotidownloader.com/en', { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: 'before-cloudflare.png' });

    console.log('Waiting for Cloudflare challenge...');
    await sleep(10000);
    await page.screenshot({ path: 'before-cloudflare3.png' });

    console.log('Handling cookie consent...');
    const consentButton = await page.$('aria/Consent');
    if (consentButton) {
      await consentButton.click();
      console.log('Clicked Consent button');
    }
    const agreeButton = await page.$('aria/AGREE');
    if (agreeButton) {
      await agreeButton.click();
      console.log('Clicked AGREE button');
    }

    console.log('Filling in Spotify track URL...');
    await page.waitForSelector('input', { visible: true });
    await page.focus('input');
    // await page.evaluate(() => { document.querySelector('input')!.value = 'https://open.spotify.com/track/04UfII2w4nrqX34USAzkGw'; });
    await page.type('input', 'https://open.spotify.com/track/04UfII2w4nrqX34USAzkGw', { delay: 100 });
    await sleep(5000);
    console.log('Typed track URL');

    console.log('Clicking first Download button...');
    await page.realClick("aria/Download")

    await sleep(3000)
    console.log('Setting up request interception...');
    await page.setRequestInterception(true);
    let token: string | null = null;

    page.on('request', (request) => {
      const url = request.url();
      if (url.startsWith('https://api.spotidownloader.com/')) {
        const urlObject = new URL(url);
        token = urlObject.searchParams.get('token');
        console.log('Extracted Token:', token);
      }
      request.continue();
    });

    console.log('Clicking second Download button...');
    await page.realClick("aria/Download")

    console.log('Waiting for token extraction...');
    await sleep(5000);

    await page.screenshot({ path: 'before-cloudflare2.png' });

    if (!token) {
      throw new Error('Token not found in intercepted requests');
    }

    console.log('Sending token to Cassett API...');
    const response = await fetch(`https://cassett.app/api/admin/updateSpotDT?token=${token}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    console.log('Cassett API Response:', data);

    res.status(200).json({ success: true, token, data });
  } catch (error: any) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log('Browser closed');
      } catch (closeError: any) {
        console.error('Error closing browser:', closeError.message);
      }
    }
  }
}
