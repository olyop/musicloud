import ReactDOM from "react-dom"
import { createElement, FC } from "react"
import { BrowserRouter as ReactRouter } from "react-router-dom"

import Pages from "./components/pages"
import Header from "./components/header"
import Footer from "./components/footer"

const Root: FC = () => (
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