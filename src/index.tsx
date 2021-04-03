import React from "react"
import ReactDOM from "react-dom"

import Index from "./pages"
import log from "./log"

const youtubePlusRoot = document.createElement("div")
youtubePlusRoot.id = "youtube-plus-root"
document.body.appendChild(youtubePlusRoot)

log("Hello, I'm here.")

ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  youtubePlusRoot
)
