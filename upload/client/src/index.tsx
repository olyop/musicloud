import { Buffer } from "buffer"
import ReactDOM from "react-dom"
import { createElement, VFC } from "react"
import { BrowserRouter as ReactRouter } from "react-router-dom"

import Pages from "./components/pages"
import Header from "./components/header"
import Footer from "./components/footer"

if (typeof window !== "undefined" && typeof Buffer === "undefined") {
	window.Buffer = Buffer
}

const Root: VFC = () => (
	<ReactRouter>
		<Header/>
		<Pages/>
		<Footer/>
	</ReactRouter>
)

ReactDOM.render(
	<Root/>,
	document.getElementById("Root"),
)