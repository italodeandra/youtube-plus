import { proxy, subscribe } from "valtio"

const stateFromStorage =
  typeof window !== `undefined` && localStorage.getItem("state")
    ? JSON.parse(localStorage.getItem("state")!)
    : {}

const state = proxy<{
  isWatchedHidden: boolean
  isPlaylistsHidden: boolean
  isMixesHidden: boolean
  contextMenu: null | { mouseX: number; mouseY: number; videoId: string }
}>({
  isWatchedHidden: false,
  isPlaylistsHidden: false,
  isMixesHidden: false,
  ...stateFromStorage,
  contextMenu: null,
})
subscribe(state, () => localStorage.setItem("state", JSON.stringify(state)))

export default state
