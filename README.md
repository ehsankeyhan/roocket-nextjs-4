This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


PORT=3001 pm2 start npm --name "giftomo" -- start


f6c3a369

sudo npm install -g n
sudo n latest
or
apt install npm
sudo apt install -y nodejs


npm install express puppeteer-real-browser puppeteer-extra-plugin-stealth axios
sudo apt-get install xvfb

find browser:
dpkg --get-selections | grep -i browser

wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

sudo apt install -y ./google-chrome-stable_current_amd64.deb

google-chrome --version
node spotifyDownloader.js
npm install -g pm2
pm2 start spotifyDownloader.js --name spotify-downloader
pm2 start tokenScraper.js --name tokenScraper
pm2 startup
pm2 save


sudo nano /etc/tmpfiles.d/tmp.conf

add this:
d /tmp 1777 root root 1d

sudo systemctl restart systemd-tmpfiles-clean


sudo systemctl status systemd-tmpfiles-clean --no-pager


force clean :
sudo systemd-tmpfiles --clean
ls -lah /tmp

