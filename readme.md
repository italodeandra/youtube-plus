<img src="logo.svg" alt="YouTube">
<br />
<br />

<code>youtube-plus.js</code> improves YouTube's tracking of watched videos

![GitHub branch checks state](https://img.shields.io/github/checks-status/italodeandra/youtube-plus/main?style=flat&colorA=000000)
[![Version](https://img.shields.io/github/package-json/v/italodeandra/youtube-plus?style=flat&colorA=000000&colorB=000000)](https://github.com/italodeandra/youtube-plus/releases)

#### Add the following script to any browser script addon

You don't need to manually update on future releases.

```js
// ==UserScript==
// @name           YouTube Plus
// @description    Improve YouTube's tracking of watched videos
// @author         Ítalo Andrade
// @include        *youtube.com/*
// @version        latest
// ==/UserScript==

(async () => {
  const youtubePlus = await fetch("https://youtube-plus.italodeandra.de/static/js/youtube-plus.js").then(res => res.text());
  eval(youtubePlus)
})()
```
