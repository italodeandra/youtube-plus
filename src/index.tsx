import React from "react"
import ReactDOM from "react-dom"

import Index from "./pages/index"

const youtubePlusRoot = document.createElement("div")
youtubePlusRoot.id = "youtube-plus-root"
document.body.appendChild(youtubePlusRoot)

console.log("Olá, cheguei.")

ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  youtubePlusRoot
)
