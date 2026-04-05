# YouTube Plus

YouTube Plus is a Chrome extension backed by a Next.js API that keeps a synced list of watched videos.

## Features

- Mark videos as watched
- Hide watched videos
- Sync watched state across devices

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
