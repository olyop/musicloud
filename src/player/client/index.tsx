import ReactDOM from "react-dom"
import { createElement, FC } from "react"
import { ApolloProvider } from "@apollo/client"
import { Provider as ReduxProvider } from "react-redux"
import { BrowserRouter as ReactRouter } from "react-router-dom"

import Pages from "./pages"
import client from "./apollo"
import { store } from "./redux"
import Bar from "./components/bar"
import Header from "./components/header"
import Loading from "./components/loading"
import Sidebar from "./components/sidebar"
import Fullscreen from "./components/fullscreen"
import Authorization from "./pages/authorization"

const ReactRedux: FC = ({ children }) => (
	<ReduxProvider store={store}>
		{children}
	</ReduxProvider>
)

const ApolloClient: FC = ({ children }) => (
	<ApolloProvider client={client}>
		{children}
	</ApolloProvider>
)

const Root: FC = () => (
	<ReactRedux>
		<ReactRouter>
			<ApolloClient>
				<Fullscreen>
					<Loading/>
					<Authorization>
						<Sidebar/>
						<Header/>
						<Pages/>
						<Bar/>
					</Authorization>
				</Fullscreen>
			</ApolloClient>
		</ReactRouter>
	</ReactRedux>
)

ReactDOM.render(
	<Root/>,
	document.getElementById("Root"),
)

if (process.env.SERVICE_WORKER === "true") {
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", () => {
			navigator.serviceWorker.register("/service-worker.js")
		})
	}
}