# YouTube Plus

YouTube Plus is a Chrome extension backed by a Next.js API that keeps a synced list of watched videos.

## Features

- Mark videos as watched
- Hide watched videos
- Sync watched state across devices

## How to use in production

1. Clone or download this repository.
2. Open Chrome (or any Chromium browser) and go to `chrome://extensions/`.
3. Enable **Developer mode** via the toggle in the top right.
4. Click **Load unpacked** and select the [`extension/`](extension) folder.

The extension automatically connects to the hosted production API by default (`https://youtube-plus.italodeandra.de/api`).

## Local development

1. Install dependencies with `npm install`.
2. Create `.env.local` from `.env.example`.
3. Start the API with `npm run dev`.
4. Load the [`extension/`](extension) directory as an unpacked extension in Chrome.

## Local API override

The extension defaults to the hosted API. To point a YouTube tab at a local backend, run this in the browser console:

```js
localStorage.setItem("ytplus-api-url", "http://localhost:3000/api");
```

To switch the tab back to the hosted API:

```js
localStorage.removeItem("ytplus-api-url");
```
