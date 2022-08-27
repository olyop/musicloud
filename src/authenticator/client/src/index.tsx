import { createRoot } from "react-dom/client"
import { createElement, StrictMode } from "react"

import Application from "./application"

const rootElement =
	document.getElementById("Root")!

const root =
	createRoot(rootElement)

root.render(
	<StrictMode>
		<Application/>
	</StrictMode>,
)