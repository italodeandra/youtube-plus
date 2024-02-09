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

function loadCss(css) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

function getId(href) {
  return href.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  )?.[1];
}

const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>`;
const eyeSlashIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
</svg>`;
const cogIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
`;

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

// function removeElement(el) {
//   el.parentNode.removeChild(el);
// }

(async () => {
  loadCss(`
    [data-ytplus-watched=true] {
      opacity: 0.3;
      transition: opacity 200ms;
    }
    [data-ytplus-watched=true]:hover {
      opacity: 1;
    }
    [data-ytplus-hide-watched=true] [data-ytplus-watched=true]:not(ytd-notification-renderer) {
      display: none;
    }
    
    #ytplus {
      position: fixed;
      bottom: 10px;
      right: 10px;
      z-index: 1000;
      background: #000;
      color: #fff;
      border-radius: 5px;
      padding: 10px;
      font-size: 16px;
    }
    #ytplus .icon {
      line-height: 0;
    }
    #ytplus:hover svg {
      display: none;
    }
    #ytplus .settings {
      display: none;
    }
    #ytplus:hover .settings {
      display: block;
    }
    
    .ytplus-video-actions {
      position: absolute;
      top: 5px;
      left: 5px;
      opacity: 0;
      transition: opacity 200ms;
    }
    .ytplus-video-actions.visible {
      opacity: 1;
    }
    
    [data-ytplus-checked]:hover .ytplus-video-actions {
      opacity: 1;
    }
    
    .ytplus-button {
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid transparent;
      transition: border 200ms;
      color: #fff;
      border-radius: 5px;
      padding: 5px;
      line-height: 0;
    }
    .ytplus-button:hover {
      border-color: rgba(0, 0, 0, 0.7);
    }
    
    .ytplus-button svg,
    #ytplus .icon svg {
      width: 20px;
      height: 20px;
    }
    
    ytd-menu-renderer .ytplus-button {
      margin-right: 10px;
      width: 40px;
    }
    
    // [data-ytplus-watched=true] .ytplus-video-actions button svg.eye {
    //   display: none;
    // }
    // [data-ytplus-watched=true] .ytplus-video-actions button svg.eye-slash {
    //   display: block;
    // }
    //
    // [data-ytplus-watched=false] .ytplus-video-actions button svg.eye {
    //   display: block;
    // }
    // [data-ytplus-watched=false] .ytplus-video-actions button svg.eye-slash {
    //   display: none;
    // }
  `);

  const userId = await fetch("https://www.youtube.com/profile").then((res) => {
    if (!res.url.startsWith("https://www.youtube.com/channel/")) {
      throw Error("Can't get the ID");
    }
    return res.url.replace("https://www.youtube.com/channel/", "");
  });

  async function get(path, queryString) {
    return fetch(
      `${API_URL}/watched-video/${path}?userId=${userId}&${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());
  }

  async function post(path, body) {
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
  }

  const hideWatched = localStorage.getItem("ytplus-hide-watched");
  if (hideWatched) {
    document.body.setAttribute("data-ytplus-hide-watched", "true");
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div id="ytplus">
        <div class="icon">
          ${cogIcon}
        </div>
        
        <div class="settings">
          <button class="ytplus-button toggle-hide">${
            hideWatched ? "Show watched" : "Hide watched"
          }</button>
        </div>
      </div>
    `
  );
  const toggleHideButton = document.body.querySelector("#ytplus .toggle-hide");
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

  let timer;

  console.info("YouTube Plus is running...");

  const observer = new MutationObserver(() => {
    if (!timer) {
      timer = setTimeout(async () => {
        const videosElToCheck = Array.from(
          document.querySelectorAll(
            "ytd-rich-item-renderer:not([data-ytplus-checked])," +
              "ytd-video-renderer:not([data-ytplus-checked])," +
              "ytd-compact-video-renderer:not([data-ytplus-checked])," +
              "ytd-notification-renderer:not([data-ytplus-checked])"
          )
        );
        // console.log("videosElToCheck", videosElToCheck);
        const videosToCheck = videosElToCheck
          .map((el) => ({
            el,
            id: getId(el.querySelector("a").href),
          }))
          .filter((v) => v.id);

        // console.log("videosToCheck", videosToCheck);

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
                  <button class="ytplus-button watched">
                    ${isWatched ? eyeSlashIcon : eyeIcon}
                  </button>  
                </div>
              `
              );
              thumbnailEl
                .querySelector(".watched")
                .addEventListener("click", async () => {
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
                    el.querySelector(
                      ".ytplus-video-actions .watched"
                    ).innerHTML = isWatched ? eyeSlashIcon : eyeIcon;
                  }
                });
            }

            video.el.setAttribute("data-ytplus-watched", isWatched);
          }
        }

        const currentVideoMetadata = document.querySelector(
          "ytd-watch-metadata:not([data-ytplus-checked])"
        );
        if (currentVideoMetadata) {
          currentVideoMetadata.setAttribute("data-ytplus-checked", "true");
          const videoId = currentVideoMetadata.getAttribute("video-id");

          let isWatched = await get("check", `videosIds=${videoId}`).then(
            (watchedVideos) => watchedVideos.includes(videoId)
          );

          const menuEl = document.querySelector("ytd-menu-renderer");
          menuEl.insertAdjacentHTML(
            "afterbegin",
            `
              <button class="ytplus-button watched">
                ${isWatched ? eyeSlashIcon : eyeIcon}
              </button>  
            `
          );
          const watchedButton = menuEl.querySelector(".watched");
          watchedButton.addEventListener("click", async () => {
            if (isWatched) {
              await post("remove", { videoId: videoId });
            } else {
              await post("add", { videoId: videoId });
            }
            isWatched = !isWatched;

            watchedButton.innerHTML = isWatched ? eyeSlashIcon : eyeIcon;

            // for (const el of Array.from(
            //   document.querySelectorAll(`[data-ytplus-id="${videoId}"]`)
            // )) {
            //   el.setAttribute("data-ytplus-watched", isWatched);
            //   el.querySelector(".ytplus-video-actions .watched").innerHTML =
            //     isWatched ? eyeSlashIcon : eyeIcon;
            // }
          });
        }

        timer = null;
      }, 1000);
    }
  });

  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
  });
})();
