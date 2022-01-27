import ReactDOM from "react-dom"
import { createElement, FC, VFC } from "react"
import { ApolloProvider } from "@apollo/client"
import { Provider as ReduxProvider } from "react-redux"
import { TITLE } from "@oly_op/music-app-common/metadata"
import { MetadataProvider } from "@oly_op/react-metadata"
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
import ApplySettings from "./components/apply-settings"

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

const Metadata: FC = ({ children }) => (
	<MetadataProvider appTitle={TITLE}>
		{children}
	</MetadataProvider>
)

const Root: VFC = () => (
	<Metadata>
		<ReactRedux>
			<ReactRouter>
				<ApolloClient>
					<ApplySettings>
						<Fullscreen>
							<Loading/>
							<Authorization>
								<Sidebar/>
								<Header/>
								<Pages/>
								<Bar/>
							</Authorization>
						</Fullscreen>
					</ApplySettings>
				</ApolloClient>
			</ReactRouter>
		</ReactRedux>
	</Metadata>
)

ReactDOM.render(
	<Root/>,
	document.getElementById("Root"),
)

if (process.env.SERVICE_WORKER === "true") {
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", () => {
			void navigator.serviceWorker.register("/service-worker.js")
		})
	}
}