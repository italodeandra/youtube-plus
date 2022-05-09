import { useEffect, useState } from "react"
import log from "./log"
import config from "./config"
import state from "./state"
import { useFirstMountState } from "react-use"
import { useSnapshot } from "valtio"

class YouTubeCrawler {
  get currentVideoId() {
    return window.location.href.match(config.youtubeRegex)?.[1] || null
  }

  get videos() {
    return document.querySelectorAll<HTMLAnchorElement>(
      "ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-video-renderer, ytd-rich-item-renderer"
    )
  }

  get mixes() {
    return document.querySelectorAll<HTMLAnchorElement>(
      "ytd-compact-radio-renderer"
    )
  }

  get playlists() {
    return document.querySelectorAll<HTMLAnchorElement>(
      "ytd-compact-playlist-renderer"
    )
  }

  getId(element: HTMLAnchorElement) {
    const thumbnail = element.querySelector<HTMLAnchorElement>("a#thumbnail")
    return thumbnail?.href.match(config.youtubeRegex)?.[1]
  }

  show(element: HTMLAnchorElement) {
    element.style.display = ""
  }

  hide(element: HTMLAnchorElement) {
    element.style.display = "none"
  }

  setStyleWatched(element: HTMLAnchorElement) {
    element.style.opacity = "0.5"
  }

  unsetStyleWatched(element: HTMLAnchorElement) {
    element.style.opacity = ""
  }

  handleContextMenu(element: HTMLAnchorElement) {
    if (!element.classList.contains("ytp-context-menu")) {
      element.addEventListener("contextmenu", (event) => {
        const videoId = this.getId(element)
        event.preventDefault()
        if (videoId) {
          state.contextMenu =
            state.contextMenu === null
              ? {
                  mouseX: event.clientX - 2,
                  mouseY: event.clientY - 4,
                  videoId,
                }
              : null
        }
      })
      element.classList.add("ytp-context-menu")
    }
  }
}

let isRunning = false

async function runYouTubeCrawler(
  watchedVideos: string[],
  setCurrentVideoId: (videoId: string | null) => void
) {
  if (!isRunning) {
    isRunning = true

    const tick = async () => {
      try {
        const youTubeCrawler = new YouTubeCrawler()
        const {
          currentVideoId,
          videos,
          getId,
          hide,
          show,
          setStyleWatched,
          unsetStyleWatched,
          mixes,
          playlists,
        } = youTubeCrawler

        for (let i = 0; i < videos.length; i++) {
          const video = videos[i]
          const id = getId(video)
          if (id) {
            youTubeCrawler.handleContextMenu(video)
            if (watchedVideos.includes(id)) {
              setStyleWatched(video)
              if (state.isWatchedHidden) {
                hide(video)
              } else if (video) {
                show(video)
              }
            } else if (video) {
              unsetStyleWatched(video)
              show(video)
            }
          }
        }

        for (let i = 0; i < playlists.length; i++) {
          const playlist = playlists[i]
          if (state.isPlaylistsHidden) {
            hide(playlist)
          } else if (playlist) {
            show(playlist)
          }
        }

        for (let i = 0; i < mixes.length; i++) {
          const mix = mixes[i]
          if (state.isMixesHidden) {
            hide(mix)
          } else if (mix) {
            show(mix)
          }
        }

        setCurrentVideoId(currentVideoId)
      } catch (err) {
        console.error(err)
      }
    }

    await tick()

    isRunning = false
  }
}

export default function useYouTubeCrawler(
  profileId?: string,
  watchedVideos?: string[]
) {
  const snap = useSnapshot(state)

  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)

  const isFirstMount = useFirstMountState()

  useEffect(() => {
    if (
      profileId &&
      watchedVideos &&
      window.location.hostname === "www.youtube.com"
    ) {
      if (isFirstMount) {
        log("I'm reading YouTube...")
      }

      void runYouTubeCrawler(watchedVideos, setCurrentVideoId)

      const interval = setInterval(
        runYouTubeCrawler.bind(null, watchedVideos, setCurrentVideoId),
        1000
      )

      return () => clearInterval(interval)
    }
  }, [profileId, watchedVideos, snap.isWatchedHidden])

  return [currentVideoId]
}
