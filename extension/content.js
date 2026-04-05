// noinspection CssInvalidHtmlTagReference

const DEFAULT_API_URL = "https://youtube-plus.italodeandra.de/api";
const CHECK_BATCH_SIZE = 75;
const CHECK_DEBOUNCE_MS = 150;
const SCAN_IDLE_TIMEOUT_MS = 500;
const VIEWPORT_MARGIN_PX = 300;

const VIDEO_RENDERER_SELECTOR = [
  "ytd-rich-item-renderer",
  "ytd-video-renderer",
  "ytd-compact-video-renderer",
  "ytd-notification-renderer",
  "ytd-playlist-video-renderer",
  "ytd-playlist-panel-video-renderer",
  "ytd-reel-item-renderer",
  "ytd-grid-video-renderer",
  "yt-lockup-view-model",
  ".ytp-videowall-still",
  "ytm-shorts-lockup-view-model-v2",
].join(",");

const THUMBNAIL_SELECTOR = [
  "ytd-thumbnail",
  "yt-thumbnail-view-model",
  ".shortsLockupViewModelHostThumbnailContainer",
].join(",");

const WATCH_MENU_SELECTOR = "ytd-watch-metadata ytd-menu-renderer";
const SHORTS_MENU_SELECTOR = "ytd-reel-player-overlay-renderer #actions";

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
</svg>`;
const loadingIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="4" cy="12" r="3" fill="currentColor"><animate id="svgSpinners3DotsFade0" fill="freeze" attributeName="opacity" begin="0;svgSpinners3DotsFade1.end-0.375s" dur="1.125s" values="1;0.2"/></circle><circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.4"><animate fill="freeze" attributeName="opacity" begin="svgSpinners3DotsFade0.begin+0.225s" dur="1.125s" values="1;0.2"/></circle><circle cx="20" cy="12" r="3" fill="currentColor" opacity="0.3"><animate id="svgSpinners3DotsFade1" fill="freeze" attributeName="opacity" begin="svgSpinners3DotsFade0.begin+0.45s" dur="1.125s" values="1;0.2"/></circle></svg>`;

const scheduleIdleWork = window.requestIdleCallback
  ? (callback) =>
      window.requestIdleCallback(callback, {
        timeout: SCAN_IDLE_TIMEOUT_MS,
      })
  : (callback) => window.setTimeout(callback, 1);

function getApiUrl() {
  try {
    const override = window.localStorage.getItem("ytplus-api-url")?.trim();

    if (override) {
      return override;
    }
  } catch (error) {
    console.warn("YouTube Plus failed to read the API override.", error);
  }

  return DEFAULT_API_URL;
}

function getId(href) {
  return href?.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
  )?.[1];
}

function getVideoIdFromElement(videoElement) {
  return getId(
    videoElement.querySelector("a[href]")?.href ??
      videoElement.getAttribute("href") ??
      videoElement.href,
  );
}

function getCurrentVideoId() {
  return getId(window.location.href);
}

function getUserId() {
  return fetch("https://www.youtube.com/profile").then((response) => {
    if (!response.url.startsWith("https://www.youtube.com/channel/")) {
      throw new Error("Unable to determine the current YouTube user.");
    }

    return response.url
      .replace("https://www.youtube.com/channel/", "")
      .replace(/\/$/, "");
  });
}

function createRequestFunctions(userId) {
  const apiUrl = getApiUrl();

  return {
    async get(path, query) {
      const params = new URLSearchParams({
        userId,
        ...query,
      });
      const response = await fetch(
        `${apiUrl}/watched-video/${path}?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error(`GET ${path} failed with status ${response.status}.`);
      }

      return response.json();
    },
    async post(path, body) {
      const response = await fetch(`${apiUrl}/watched-video/${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...body,
        }),
      });

      if (!response.ok) {
        throw new Error(`POST ${path} failed with status ${response.status}.`);
      }

      return response;
    },
  };
}

function chunkItems(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function isElementNearViewport(element) {
  const rect = element.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) {
    return false;
  }

  return (
    rect.bottom >= -VIEWPORT_MARGIN_PX &&
    rect.top <= window.innerHeight + VIEWPORT_MARGIN_PX
  );
}

function waitForBody() {
  return new Promise((resolve) => {
    if (document.body) {
      resolve();
      return;
    }

    document.addEventListener("DOMContentLoaded", resolve, {
      once: true,
    });
  });
}

(async () => {
  await waitForBody();

  const userId = await getUserId();
  const { get, post } = createRequestFunctions(userId);
  const watchedState = new Map();
  const videoVersions = new Map();
  const elementVideoIds = new WeakMap();
  const visibleElementIds = new WeakMap();
  const observedVideoElements = new WeakSet();
  const elementsByVideoId = new Map();
  const visibleVideoCounts = new Map();
  const pendingCheckIds = new Set();

  let activeMutationRequests = 0;
  let checkInFlight = false;
  let checkTimer = null;
  let currentUrl = window.location.href;
  let pageScanScheduled = false;

  const style = document.createElement("style");
  style.textContent = `
    #ytplus {
      position: fixed;
      right: 10px;
      bottom: 10px;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 5px;
      border-radius: 5px;
      background: #09090b;
      color: #fff;
      font-size: 16px;
    }

    .no-scroll #ytplus {
      display: none;
    }

    .ytplus-icon {
      line-height: 0;
    }

    .ytplus-icon svg {
      width: 20px;
      height: 20px;
    }

    .ytplus-button {
      border: 1px solid transparent;
      border-radius: 5px;
      background: #18181b;
      color: #fff;
      padding: 5px;
      transition: border 200ms;
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

    .eye-slash-icon,
    [data-ytplus-watched] .eye-icon {
      display: none;
    }

    .eye-icon,
    [data-ytplus-watched] .eye-slash-icon {
      display: block;
    }

    ytd-menu-renderer .ytplus-watched-button {
      margin: auto 10px;
    }

    .ytplus-video-actions {
      position: absolute;
      top: 5px;
      left: 5px;
      z-index: 1000000;
      opacity: 0;
      transition: opacity 200ms;
    }

    ytd-thumbnail:hover .ytplus-video-actions,
    yt-thumbnail-view-model:hover .ytplus-video-actions,
    .shortsLockupViewModelHostThumbnailContainer:hover .ytplus-video-actions,
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
  `;
  document.head.appendChild(style);

  const hideWatched = window.localStorage.getItem("ytplus-hide-watched");
  if (hideWatched) {
    document.body.setAttribute("data-ytplus-hide-watched", "true");
  }

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
          <button id="ytplus-toggle-hide" type="button" class="ytplus-button">
            ${hideWatched ? "Show watched" : "Hide watched"}
          </button>
        </div>
      </div>
    `,
  );

  const toggleHideButton = document.querySelector("#ytplus-toggle-hide");
  toggleHideButton.addEventListener("click", () => {
    const isHidingWatched =
      document.body.getAttribute("data-ytplus-hide-watched") === "true";

    if (isHidingWatched) {
      document.body.removeAttribute("data-ytplus-hide-watched");
      toggleHideButton.textContent = "Hide watched";
      window.localStorage.removeItem("ytplus-hide-watched");
      return;
    }

    document.body.setAttribute("data-ytplus-hide-watched", "true");
    toggleHideButton.textContent = "Show watched";
    window.localStorage.setItem("ytplus-hide-watched", "true");
  });

  function isVideoWatched(videoId) {
    return videoId ? watchedState.get(videoId) === true : false;
  }

  function getVideoVersion(videoId) {
    return videoVersions.get(videoId) ?? 0;
  }

  function bumpVideoVersion(videoId) {
    videoVersions.set(videoId, getVideoVersion(videoId) + 1);
  }

  function setLoadingState(isLoading) {
    activeMutationRequests += isLoading ? 1 : -1;
    activeMutationRequests = Math.max(activeMutationRequests, 0);

    if (activeMutationRequests > 0) {
      document.body.setAttribute("data-ytplus-loading", "true");
      return;
    }

    document.body.removeAttribute("data-ytplus-loading");
  }

  function setElementWatchedState(element, isWatched) {
    if (isWatched) {
      element.setAttribute("data-ytplus-watched", "true");
      return;
    }

    element.removeAttribute("data-ytplus-watched");
  }

  function incrementVisibleVideo(videoId) {
    visibleVideoCounts.set(videoId, (visibleVideoCounts.get(videoId) ?? 0) + 1);
  }

  function decrementVisibleVideo(videoId) {
    const count = (visibleVideoCounts.get(videoId) ?? 0) - 1;

    if (count > 0) {
      visibleVideoCounts.set(videoId, count);
      return;
    }

    visibleVideoCounts.delete(videoId);
  }

  function setVisibleVideoId(videoElement, nextVideoId) {
    const previousVideoId = visibleElementIds.get(videoElement);

    if (previousVideoId === nextVideoId) {
      return;
    }

    if (previousVideoId) {
      decrementVisibleVideo(previousVideoId);
    }

    if (!nextVideoId) {
      visibleElementIds.delete(videoElement);
      return;
    }

    incrementVisibleVideo(nextVideoId);
    visibleElementIds.set(videoElement, nextVideoId);
  }

  function removeVideoElementRegistration(videoElement, videoId) {
    const registeredElements = elementsByVideoId.get(videoId);
    if (registeredElements) {
      registeredElements.delete(videoElement);

      if (registeredElements.size === 0) {
        elementsByVideoId.delete(videoId);
      }
    }

    setVisibleVideoId(videoElement, null);
    elementVideoIds.delete(videoElement);
  }

  function applyWatchedStateToVideo(videoId, isWatched) {
    watchedState.set(videoId, isWatched);

    const registeredElements = elementsByVideoId.get(videoId);
    if (registeredElements) {
      for (const videoElement of [...registeredElements]) {
        if (!document.contains(videoElement)) {
          removeVideoElementRegistration(videoElement, videoId);
          continue;
        }

        setElementWatchedState(videoElement, isWatched);
      }
    }

    if (videoId === getCurrentVideoId()) {
      syncCurrentVideoState();
    }
  }

  function ensureVideoActionButton(videoElement) {
    const thumbnailElement = videoElement.querySelector(THUMBNAIL_SELECTOR);

    if (!thumbnailElement || thumbnailElement.querySelector(".ytplus-video-actions")) {
      return;
    }

    thumbnailElement.insertAdjacentHTML(
      "beforeend",
      `
        <div class="ytplus-video-actions">
          <button type="button" class="ytplus-button ytplus-icon ytplus-video-button">
            ${eyeSlashIcon}
            ${eyeIcon}
          </button>
        </div>
      `,
    );

    const button = thumbnailElement.querySelector(".ytplus-video-button");
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      event.preventDefault();

      const videoId = elementVideoIds.get(videoElement) ?? getVideoIdFromElement(videoElement);
      if (!videoId) {
        return;
      }

      await toggleWatchedState(videoId);
    });
  }

  function ensureWatchButton(container, getVideoId) {
    if (container.querySelector(".ytplus-watched-button")) {
      return;
    }

    container.insertAdjacentHTML(
      "afterbegin",
      `
        <button type="button" class="ytplus-watched-button ytplus-button ytplus-icon">
          ${eyeSlashIcon}
          ${eyeIcon}
        </button>
      `,
    );

    const button = container.querySelector(".ytplus-watched-button");
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      event.preventDefault();

      const videoId = getVideoId();
      if (!videoId) {
        return;
      }

      await toggleWatchedState(videoId);
    });
  }

  function syncCurrentVideoState() {
    const currentVideoId = getCurrentVideoId();
    const watchMenu = document.querySelector(WATCH_MENU_SELECTOR);

    if (watchMenu) {
      setElementWatchedState(watchMenu, isVideoWatched(currentVideoId));
    }

    for (const shortsMenu of document.querySelectorAll(SHORTS_MENU_SELECTOR)) {
      setElementWatchedState(shortsMenu, isVideoWatched(currentVideoId));
    }
  }

  function syncVideoElement(videoElement) {
    const previousVideoId = elementVideoIds.get(videoElement);
    const nextVideoId = getVideoIdFromElement(videoElement);

    if (!nextVideoId) {
      if (previousVideoId) {
        removeVideoElementRegistration(videoElement, previousVideoId);
      }

      return;
    }

    if (previousVideoId !== nextVideoId) {
      if (previousVideoId) {
        removeVideoElementRegistration(videoElement, previousVideoId);
      }

      let registeredElements = elementsByVideoId.get(nextVideoId);
      if (!registeredElements) {
        registeredElements = new Set();
        elementsByVideoId.set(nextVideoId, registeredElements);
      }

      registeredElements.add(videoElement);
      elementVideoIds.set(videoElement, nextVideoId);
    }

    ensureVideoActionButton(videoElement);
    setElementWatchedState(videoElement, isVideoWatched(nextVideoId));

    if (visibleElementIds.has(videoElement)) {
      setVisibleVideoId(videoElement, nextVideoId);
    }

    if (isElementNearViewport(videoElement)) {
      queueWatchedStateCheck([nextVideoId]);
    }
  }

  function scheduleCheckFlush() {
    if (checkTimer || checkInFlight) {
      return;
    }

    checkTimer = window.setTimeout(() => {
      checkTimer = null;
      void flushPendingChecks();
    }, CHECK_DEBOUNCE_MS);
  }

  function queueWatchedStateCheck(videoIds, options = {}) {
    const { force = false } = options;
    let shouldFlush = false;

    for (const videoId of videoIds) {
      if (!videoId) {
        continue;
      }

      if (!force && watchedState.has(videoId)) {
        continue;
      }

      pendingCheckIds.add(videoId);
      shouldFlush = true;
    }

    if (shouldFlush) {
      scheduleCheckFlush();
    }
  }

  async function flushPendingChecks() {
    if (checkInFlight || pendingCheckIds.size === 0) {
      return;
    }

    checkInFlight = true;

    const requestedIds = [...pendingCheckIds];
    pendingCheckIds.clear();

    const requestVersions = new Map(
      requestedIds.map((videoId) => [videoId, getVideoVersion(videoId)]),
    );

    try {
      for (const batch of chunkItems(requestedIds, CHECK_BATCH_SIZE)) {
        const watchedIds = new Set(
          await get("check", {
            videoIds: batch.join(","),
          }),
        );

        for (const videoId of batch) {
          if (requestVersions.get(videoId) !== getVideoVersion(videoId)) {
            continue;
          }

          applyWatchedStateToVideo(videoId, watchedIds.has(videoId));
        }
      }
    } catch (error) {
      console.error(error);

      for (const videoId of requestedIds) {
        pendingCheckIds.add(videoId);
      }
    } finally {
      checkInFlight = false;

      if (pendingCheckIds.size > 0) {
        scheduleCheckFlush();
      }
    }
  }

  async function updateVideoWatchedState(videoId, nextState) {
    const previousState = isVideoWatched(videoId);

    bumpVideoVersion(videoId);
    applyWatchedStateToVideo(videoId, nextState);

    try {
      setLoadingState(true);
      await post(nextState ? "add" : "remove", { videoId });
    } catch (error) {
      console.error(error);
      bumpVideoVersion(videoId);
      applyWatchedStateToVideo(videoId, previousState);
    } finally {
      setLoadingState(false);
    }
  }

  async function toggleWatchedState(videoId) {
    await updateVideoWatchedState(videoId, !isVideoWatched(videoId));
  }

  function refreshVisibleVideos(force = false) {
    const videoIds = [...visibleVideoCounts.keys()];
    const currentVideoId = getCurrentVideoId();

    if (currentVideoId) {
      videoIds.push(currentVideoId);
    }

    queueWatchedStateCheck(videoIds, {
      force,
    });
  }

  function syncWatchMenus() {
    const currentVideoId = getCurrentVideoId();
    const watchMenu = document.querySelector(WATCH_MENU_SELECTOR);

    if (watchMenu) {
      ensureWatchButton(watchMenu, getCurrentVideoId);
      setElementWatchedState(watchMenu, isVideoWatched(currentVideoId));
    }

    for (const shortsMenu of document.querySelectorAll(SHORTS_MENU_SELECTOR)) {
      ensureWatchButton(shortsMenu, getCurrentVideoId);
      setElementWatchedState(shortsMenu, isVideoWatched(currentVideoId));
    }

    if (currentVideoId) {
      queueWatchedStateCheck([currentVideoId]);
    }
  }

  function handleRouteChange() {
    if (currentUrl === window.location.href) {
      return;
    }

    currentUrl = window.location.href;
    syncCurrentVideoState();
    refreshVisibleVideos(true);
  }

  function scanPage() {
    handleRouteChange();
    syncWatchMenus();

    for (const videoElement of document.querySelectorAll(VIDEO_RENDERER_SELECTOR)) {
      if (!observedVideoElements.has(videoElement)) {
        observedVideoElements.add(videoElement);
        intersectionObserver.observe(videoElement);
      }

      syncVideoElement(videoElement);
    }
  }

  function schedulePageScan() {
    if (pageScanScheduled) {
      return;
    }

    pageScanScheduled = true;
    scheduleIdleWork(() => {
      pageScanScheduled = false;
      scanPage();
    });
  }

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      const newlyVisibleVideoIds = [];

      for (const entry of entries) {
        const videoElement = entry.target;
        syncVideoElement(videoElement);

        const videoId = elementVideoIds.get(videoElement);

        if (entry.isIntersecting && videoId) {
          setVisibleVideoId(videoElement, videoId);
          newlyVisibleVideoIds.push(videoId);
          continue;
        }

        setVisibleVideoId(videoElement, null);
      }

      queueWatchedStateCheck(newlyVisibleVideoIds);
    },
    {
      rootMargin: `${VIEWPORT_MARGIN_PX}px 0px`,
      threshold: 0.01,
    },
  );

  const mutationObserver = new MutationObserver(() => {
    schedulePageScan();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  document.addEventListener("yt-navigate-finish", () => {
    handleRouteChange();
    schedulePageScan();
    refreshVisibleVideos(true);
  });

  window.addEventListener("focus", () => {
    refreshVisibleVideos(true);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      refreshVisibleVideos(true);
    }
  });

  console.info("YouTube Plus is running...");

  scanPage();
  refreshVisibleVideos(true);
})();
