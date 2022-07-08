import { Buffer } from "buffer"
import { createRoot } from "react-dom/client"
import { createElement, StrictMode } from "react"
import { BrowserRouter as ReactRouter } from "react-router-dom"

import Pages from "./components/pages"
import Header from "./components/header"
import Footer from "./components/footer"

if (typeof window !== "undefined" && typeof Buffer === "undefined") {
	window.Buffer = Buffer
}

const rootElement =
	document.getElementById("Root")!

const root =
	createRoot(rootElement)

root.render(
	<StrictMode>
		<ReactRouter>
			<Header/>
			<Pages/>
			<Footer/>
		</ReactRouter>
	</StrictMode>,
)