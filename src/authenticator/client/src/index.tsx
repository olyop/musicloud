import { createRoot } from "react-dom/client"
import { createElement, StrictMode } from "react"

import Application from "./application"

import "@oly_op/css-utilities/index.css"
import "@oly_op/react-button/build/index.css"
import "./index.scss"

const rootElement =
	document.getElementById("Root")!

const root =
	createRoot(rootElement)

root.render(
	<StrictMode>
		<Application/>
	</StrictMode>,
)