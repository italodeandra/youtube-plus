// ==UserScript==
// @name           YouTube Plus
// @description    Improve YouTube's tracking of watched videos
// @author         Ítalo Andrade
// @include        *www.youtube.com/*
// @version        latest
// @grant          none
// ==/UserScript==
// noinspection CssInvalidHtmlTagReference

// const API_URL = "http://localhost:3000/api";
const API_URL = "https://youtube-plus.italodeandra.de/api";

// region utility functions
const style = document.createElement("style");
document.head.appendChild(style);
function appendCss(css) {
  style.textContent += css;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getId(href) {
  return href.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  )?.[1];
}

// function removeElement(el) {
//   try {
//     el.parentNode?.removeChild(el);
//   } catch (e) {
//     // already removed
//   }
// }

// endregion

// region unused functions
// function getClosestParent(element, query) {
//   let parent = element.parentElement;
//   while (parent) {
//     if (parent.matches(query)) {
//       return parent;
//     }
//     parent = parent.parentElement;
//   }
//   return null;
// }

// function loadScript(url) {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement("script");
//     script.type = "text/javascript";
//     script.src = url;
//     script.onload = resolve;
//     script.onerror = reject;
//     document.body.appendChild(script);
//   });
// }
// endregion

// region icons
const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="eye-icon">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>`;
const eyeSlashIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="eye-slash-icon">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
</svg>`;
const cogIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
`;
const loadingIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="4" cy="12" r="3" fill="currentColor"><animate id="svgSpinners3DotsFade0" fill="freeze" attributeName="opacity" begin="0;svgSpinners3DotsFade1.end-0.375s" dur="1.125s" values="1;0.2"/></circle><circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.4"><animate fill="freeze" attributeName="opacity" begin="svgSpinners3DotsFade0.begin+0.225s" dur="1.125s" values="1;0.2"/></circle><circle cx="20" cy="12" r="3" fill="currentColor" opacity="0.3"><animate id="svgSpinners3DotsFade1" fill="freeze" attributeName="opacity" begin="svgSpinners3DotsFade0.begin+0.45s" dur="1.125s" values="1;0.2"/></circle></svg>`;

// endregion

function getUserId() {
  return fetch("https://www.youtube.com/profile").then((res) => {
    if (!res.url.startsWith("https://www.youtube.com/channel/")) {
      throw Error("Can't get the ID");
    }
    return res.url.replace("https://www.youtube.com/channel/", "");
  });
}

function createRequestFunctions(userId) {
  return {
    async get(path, queryString) {
      return fetch(
        `${API_URL}/watched-video/${path}?userId=${userId}&${queryString}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());
    },
    async post(path, body) {
      return fetch(`${API_URL}/watched-video/${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...body,
        }),
      });
    },
  };
}

(async () => {
  appendCss(`
    // [data-ytplus-watched=true] {
    //   opacity: 0.3;
    //   transition: opacity 200ms;
    // }
    // [data-ytplus-watched=true]:hover {
    //   opacity: 1;
    // }
    // [data-ytplus-hide-watched=true] [data-ytplus-watched=true]:not(ytd-notification-renderer):not(ytd-playlist-video-renderer):not(ytd-playlist-panel-video-renderer) {
    //   display: none;
    // }
    //
    // [data-ytplus-hide-watched=true] ytd-compact-radio-renderer {
    //   display: none;
    // }
    //
    // #ytplus {
    //   position: fixed;
    //   bottom: 10px;
    //   right: 10px;
    //   z-index: 1000;
    //   background: #000;
    //   color: #fff;
    //   border-radius: 5px;
    //   padding: 10px;
    //   font-size: 16px;
    // }
    // .no-scroll #ytplus {
    //   display: none;
    // }
    // #ytplus .icon {
    //   line-height: 0;
    // }
    // #ytplus:hover svg {
    //   display: none;
    // }
    // #ytplus .settings {
    //   display: none;
    // }
    // #ytplus:hover .settings {
    //   display: block;
    // }
    //
    // .ytplus-video-actions {
    //   position: absolute;
    //   top: 5px;
    //   left: 5px;
    //   opacity: 0;
    //   transition: opacity 200ms;
    //   z-index: 1000;
    // }
    // .ytplus-video-actions.visible {
    //   opacity: 1;
    // }
    //
    // [data-ytplus-checked]:hover .ytplus-video-actions {
    //   opacity: 1;
    // }
    //
    // .ytplus-button {
    //   background: rgba(0, 0, 0, 0.5);
    //   border: 1px solid transparent;
    //   transition: border 200ms;
    //   color: #fff;
    //   border-radius: 5px;
    //   padding: 5px;
    //   line-height: 0;
    // }
    // .ytplus-button:hover {
    //   border-color: rgba(0, 0, 0, 0.7);
    // }
    //
    // .ytplus-button svg,
    // #ytplus .icon svg {
    //   width: 20px;
    //   height: 20px;
    // }
    //
    // ytd-menu-renderer .ytplus-button {
    //   margin-right: 10px;
    //   width: 40px;
    // }
  `);

  const userId = await getUserId();

  const { get, post } = createRequestFunctions(userId);

  const hideWatched = localStorage.getItem("ytplus-hide-watched");
  if (hideWatched) {
    document.body.setAttribute("data-ytplus-hide-watched", "true");
  }

  appendCss(`
    #ytplus {
      position: fixed;
      bottom: 10px;
      right: 10px;
      z-index: 1000;
      background: #09090b;
      color: #fff;
      border-radius: 5px;
      padding: 5px;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
    .no-scroll #ytplus {
      display: none;
    }
    
    .ytplus-icon svg {
      width: 20px;
      height: 20px;
    }
    .ytplus-icon {
      line-height: 0;
    }
    
    .ytplus-button {
      background: #18181b;
      border: 1px solid transparent;
      transition: border 200ms;
      color: #fff;
      border-radius: 5px;
      padding: 5px;
    }
    .ytplus-button:hover {
      border-color: #27272a;
    }
    .ytplus-button:active {
      border-color: #3f3f46;
    }
    
    #ytplus-settings {
      display: none;
    }
    #ytplus:hover #ytplus-settings {
      display: block;
    }
    
    #ytplus-settings-icon {
      display: block;
      margin: 4px;
    }
    #ytplus:hover #ytplus-settings-icon {
      display: none;
    }
    
    #ytplus-loading-icon {
      display: none;
      margin: 4px;
    }
    [data-ytplus-loading] #ytplus-loading-icon {
      display: block;
    }
    [data-ytplus-loading] #ytplus-settings-icon {
      display: none;
    }
  `);
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div id="ytplus">
        <div id="ytplus-settings-icon" class="ytplus-icon">
          ${cogIcon}
        </div>
        <div id="ytplus-loading-icon" class="ytplus-icon">
          ${loadingIcon}
        </div>
        
        <div id="ytplus-settings">
          <button id="ytplus-toggle-hide" class="ytplus-button">
            ${hideWatched ? "Show watched" : "Hide watched"}
          </button>
        </div>
      </div>
    `
  );
  const toggleHideButton = document.body.querySelector("#ytplus-toggle-hide");
  toggleHideButton.addEventListener("click", () => {
    const hideWatched = document.body.getAttribute("data-ytplus-hide-watched");
    if (hideWatched) {
      document.body.removeAttribute("data-ytplus-hide-watched");
      toggleHideButton.innerHTML = "Hide watched";
      localStorage.removeItem("ytplus-hide-watched");
    } else {
      document.body.setAttribute("data-ytplus-hide-watched", "true");
      toggleHideButton.innerHTML = "Show watched";
      localStorage.setItem("ytplus-hide-watched", "true");
    }
  });

  console.info("YouTube Plus is running...");

  let watched = [];
  async function updateWatched() {
    document.body.setAttribute("data-ytplus-loading", "true");
    watched = await get("list");
    document.body.removeAttribute("data-ytplus-loading");
  }
  window.addEventListener("focus", updateWatched);
  updateWatched();

  appendCss(`
    .eye-slash-icon,
    [data-ytplus-watched] .eye-icon {
      display: none;
    }
    
    .eye-icon,
    [data-ytplus-watched] .eye-slash-icon {
      display: block;
    }
    
    ytd-menu-renderer #ytplus-watched-button {
      margin: auto 10px;
    }
    
    .ytplus-video-actions {
      position: absolute;
      top: 5px;
      left: 5px;
      opacity: 0;
      transition: opacity 200ms;
      z-index: 1000000;
    }
    
    ytd-thumbnail:hover .ytplus-video-actions,
    .ytplus-video-actions:hover {
      opacity: 1;
    }
    
    [data-ytplus-watched=true]:not(ytd-menu-renderer):not(#actions) {
      opacity: 0.3;
      transition: opacity 200ms;
    }
    [data-ytplus-watched=true]:hover {
      opacity: 1;
    }
    [data-ytplus-hide-watched=true] [data-ytplus-watched=true]:not(ytd-notification-renderer):not(ytd-playlist-video-renderer):not(ytd-playlist-panel-video-renderer):not(ytd-menu-renderer):not(#actions) {
      display: none !important;
    }

    [data-ytplus-hide-watched=true] ytd-compact-radio-renderer {
      display: none;
    }
  `);

  // noinspection InfiniteRecursionJS
  async function loop() {
    try {
      const currentVideoMetadata = document.querySelector("ytd-watch-metadata");
      const menuEl = currentVideoMetadata?.querySelector("ytd-menu-renderer");
      if (menuEl) {
        const videoId = getId(window.location.href);
        let isWatched = watched.includes(videoId);
        if (isWatched) {
          menuEl.setAttribute("data-ytplus-watched", "true");
        } else {
          menuEl.removeAttribute("data-ytplus-watched");
        }
        if (!menuEl.querySelector("#ytplus-watched-button")) {
          menuEl.insertAdjacentHTML(
            "afterbegin",
            `
              <button id="ytplus-watched-button" class="ytplus-button ytplus-icon">
                ${eyeSlashIcon}
                ${eyeIcon}
              </button>  
            `
          );
          const menuWatchButton = menuEl.querySelector(
            "#ytplus-watched-button"
          );
          menuWatchButton.addEventListener("click", async () => {
            const videoId = getId(window.location.href);
            const isWatched =
              menuEl.getAttribute("data-ytplus-watched") === "true";
            document.body.setAttribute("data-ytplus-loading", "true");
            if (!isWatched) {
              watched.push(videoId);
              menuEl.setAttribute("data-ytplus-watched", "true");
              await post("add", { videoId });
            } else {
              watched = watched.filter((v) => v !== videoId);
              menuEl.removeAttribute("data-ytplus-watched");
              await post("remove", { videoId });
            }
            document.body.removeAttribute("data-ytplus-loading");
          });
        }
      }

      const shortsMenuEls = document.querySelectorAll(
        "ytd-reel-player-overlay-renderer #actions"
      );
      for (const shortsMenuEl of shortsMenuEls) {
        const videoId = getId(window.location.href);
        const isWatched = watched.includes(videoId);
        if (isWatched) {
          shortsMenuEl.setAttribute("data-ytplus-watched", "true");
        } else {
          shortsMenuEl.removeAttribute("data-ytplus-watched");
        }
        if (!shortsMenuEl.querySelector("#ytplus-watched-button")) {
          shortsMenuEl.insertAdjacentHTML(
            "afterbegin",
            `
              <button id="ytplus-watched-button" class="ytplus-button ytplus-icon">
                ${eyeSlashIcon}
                ${eyeIcon}
              </button>  
            `
          );
          const shortsWatchButton = shortsMenuEl.querySelector(
            "#ytplus-watched-button"
          );
          shortsWatchButton.addEventListener("click", async () => {
            const videoId = getId(window.location.href);
            const isWatched =
              shortsMenuEl.getAttribute("data-ytplus-watched") === "true";
            document.body.setAttribute("data-ytplus-loading", "true");
            if (!isWatched) {
              watched.push(videoId);
              shortsMenuEl.setAttribute("data-ytplus-watched", "true");
              await post("add", { videoId });
            } else {
              watched = watched.filter((v) => v !== videoId);
              shortsMenuEl.removeAttribute("data-ytplus-watched");
              await post("remove", { videoId });
            }
            document.body.removeAttribute("data-ytplus-loading");
          });
        }
      }

      const videosEls = Array.from(
        document.querySelectorAll(
          "ytd-rich-item-renderer," +
            "ytd-video-renderer," +
            "ytd-compact-video-renderer," +
            "ytd-notification-renderer," +
            "ytd-playlist-video-renderer," +
            "ytd-playlist-panel-video-renderer," +
            "ytd-reel-item-renderer"
        )
      );

      for (const videoEl of videosEls) {
        const videoId = getId(videoEl.querySelector("a").href);
        const isWatched = watched.includes(videoId);
        if (isWatched) {
          videoEl.setAttribute("data-ytplus-watched", "true");
        } else {
          videoEl.removeAttribute("data-ytplus-watched");
        }
        if (!videoEl.querySelector(".ytplus-video-actions")) {
          const thumbnailEl = videoEl.querySelector("ytd-thumbnail");
          if (thumbnailEl) {
            thumbnailEl.insertAdjacentHTML(
              "beforeend",
              `
                <div class="ytplus-video-actions">
                  <button class="ytplus-button ytplus-icon">
                    ${eyeSlashIcon}
                    ${eyeIcon}
                  </button>  
                </div>
              `
            );
            const videoWatchButton = thumbnailEl.querySelector(
              ".ytplus-video-actions .ytplus-button"
            );
            videoWatchButton.addEventListener("click", async () => {
              const videoId = getId(videoEl.querySelector("a").href);
              const isWatched =
                videoEl.getAttribute("data-ytplus-watched") === "true";
              document.body.setAttribute("data-ytplus-loading", "true");
              if (!isWatched) {
                watched.push(videoId);
                videoEl.setAttribute("data-ytplus-watched", "true");
                await post("add", { videoId });
              } else {
                watched = watched.filter((v) => v !== videoId);
                videoEl.removeAttribute("data-ytplus-watched");
                await post("remove", { videoId });
              }
              document.body.removeAttribute("data-ytplus-loading");
            });
          }
        }
      }

      /*const videoElementsToCheckIfIsSameVideo = Array.from(
        document.querySelectorAll(
          "ytd-rich-item-renderer[data-ytplus-checked]," +
            "ytd-video-renderer[data-ytplus-checked]," +
            "ytd-compact-video-renderer[data-ytplus-checked]," +
            "ytd-notification-renderer[data-ytplus-checked]," +
            "ytd-playlist-video-renderer[data-ytplus-checked]," +
            "ytd-playlist-panel-video-renderer[data-ytplus-checked]"
        )
      );
      for (const videoElement of videoElementsToCheckIfIsSameVideo) {
        const videoId = getId(videoElement.querySelector("a").href);
        if (videoId !== videoElement.getAttribute("data-ytplus-id")) {
          videoElement.removeAttribute("data-ytplus-checked");
          videoElement.removeAttribute("data-ytplus-id");
          videoElement.removeAttribute("data-ytplus-watched");
          const thumbnailEl = videoElement.querySelector("ytd-thumbnail");
          if (thumbnailEl) {
            removeElement(thumbnailEl.querySelector(".ytplus-video-actions"));
          }
        }
      }

      const videosElToCheck = Array.from(
        document.querySelectorAll(
          "ytd-rich-item-renderer:not([data-ytplus-checked])," +
            "ytd-video-renderer:not([data-ytplus-checked])," +
            "ytd-compact-video-renderer:not([data-ytplus-checked])," +
            "ytd-notification-renderer:not([data-ytplus-checked])," +
            "ytd-playlist-video-renderer:not([data-ytplus-checked])," +
            "ytd-playlist-panel-video-renderer:not([data-ytplus-checked])"
        )
      );

      const videosToCheck = videosElToCheck
        .map((el) => ({
          el,
          id: getId(el.querySelector("a").href),
        }))
        .filter((v) => v.id);

      if (videosToCheck.length) {
        const watchedVideos = await get(
          "check",
          `videosIds=${videosToCheck.map((v) => v.id).join(",")}`
        );

        // console.log("watchedVideos", watchedVideos);

        for (const video of videosToCheck) {
          let isWatched = watchedVideos.includes(video.id);
          video.el.setAttribute("data-ytplus-checked", "true");
          video.el.setAttribute("data-ytplus-id", video.id);
          const thumbnailEl = video.el.querySelector("ytd-thumbnail");
          if (thumbnailEl) {
            thumbnailEl.insertAdjacentHTML(
              "beforeend",
              `
                <div class="ytplus-video-actions">
                  <button class="ytplus-button ytplus-watched">
                    ${isWatched ? eyeSlashIcon : eyeIcon}
                  </button>  
                </div>
              `
            );
            thumbnailEl
              .querySelector(".ytplus-watched")
              .addEventListener("click", async (e) => {
                e.stopPropagation();
                if (isWatched) {
                  await post("remove", { videoId: video.id });
                } else {
                  await post("add", { videoId: video.id });
                }
                isWatched = !isWatched;

                for (const el of Array.from(
                  document.querySelectorAll(`[data-ytplus-id="${video.id}"]`)
                )) {
                  el.setAttribute("data-ytplus-watched", isWatched);
                  el.querySelector(".ytplus-watched").innerHTML = isWatched
                    ? eyeSlashIcon
                    : eyeIcon;
                }
              });
          }

          video.el.setAttribute("data-ytplus-watched", isWatched);
        }
      }

      const currentVideoMetadata = document.querySelector("ytd-watch-metadata");
      const menuEl = currentVideoMetadata?.querySelector("ytd-menu-renderer");
      if (menuEl) {
        const videoId = currentVideoMetadata.getAttribute("video-id");
        if (
          currentVideoMetadata.getAttribute("data-ytplus-checked") !== "true" ||
          !menuEl.querySelector(".ytplus-watched")
        ) {
          currentVideoMetadata.setAttribute("data-ytplus-checked", "true");
          currentVideoMetadata.setAttribute("data-ytplus-id", videoId);

          let isWatched = await get("check", `videosIds=${videoId}`).then(
            (watchedVideos) => watchedVideos.includes(videoId)
          );

          menuEl.insertAdjacentHTML(
            "afterbegin",
            `
              <button class="ytplus-button ytplus-watched">
                ${isWatched ? eyeSlashIcon : eyeIcon}
              </button>  
            `
          );
          const watchedButton = menuEl.querySelector(".ytplus-watched");
          watchedButton.addEventListener("click", async (e) => {
            e.stopPropagation();
            if (isWatched) {
              await post("remove", { videoId: videoId });
            } else {
              await post("add", { videoId: videoId });
            }
            isWatched = !isWatched;

            watchedButton.innerHTML = isWatched ? eyeSlashIcon : eyeIcon;

            for (const el of Array.from(
              document.querySelectorAll(
                `[data-ytplus-id="${videoId}"] .ytplus-watched`
              )
            )) {
              el.innerHTML = isWatched ? eyeSlashIcon : eyeIcon;
            }
          });
        } else if (
          videoId !== currentVideoMetadata.getAttribute("data-ytplus-id")
        ) {
          const watchedButton = menuEl.querySelector(".ytplus-watched");
          removeElement(watchedButton);
          currentVideoMetadata.removeAttribute("data-ytplus-checked");
          currentVideoMetadata.removeAttribute("data-ytplus-id");
        }
      }

      const shortsMenuEl = document.querySelector(
        "ytd-reel-player-overlay-renderer #actions"
      );
      if (shortsMenuEl) {
        const videoId = getId(window.location.href);
        if (
          shortsMenuEl.getAttribute("data-ytplus-checked") !== "true" ||
          !shortsMenuEl.querySelector(".ytplus-watched")
        ) {
          shortsMenuEl.setAttribute("data-ytplus-checked", "true");
          shortsMenuEl.setAttribute("data-ytplus-id", videoId);

          let isWatched = await get("check", `videosIds=${videoId}`).then(
            (watchedVideos) => watchedVideos.includes(videoId)
          );

          shortsMenuEl.insertAdjacentHTML(
            "afterbegin",
            `
              <button class="ytplus-button ytplus-watched">
                ${isWatched ? eyeSlashIcon : eyeIcon}
              </button>  
            `
          );
          const watchedButton = shortsMenuEl.querySelector(".ytplus-watched");
          watchedButton.addEventListener("click", async (e) => {
            e.stopPropagation();
            if (isWatched) {
              await post("remove", { videoId: videoId });
            } else {
              await post("add", { videoId: videoId });
            }
            isWatched = !isWatched;

            watchedButton.innerHTML = isWatched ? eyeSlashIcon : eyeIcon;

            for (const el of Array.from(
              document.querySelectorAll(
                `[data-ytplus-id="${videoId}"] .ytplus-watched`
              )
            )) {
              el.innerHTML = isWatched ? eyeSlashIcon : eyeIcon;
            }
          });
        } else if (videoId !== shortsMenuEl.getAttribute("data-ytplus-id")) {
          const watchedButton = shortsMenuEl.querySelector(".ytplus-watched");
          removeElement(watchedButton);
          shortsMenuEl.removeAttribute("data-ytplus-checked");
          shortsMenuEl.removeAttribute("data-ytplus-id");
        }
      }*/
      await wait(1000);
    } catch (e) {
      console.error(e);
      await wait(5000);
    }
    void loop();
  }

  void loop();
})();
