import ReactDOM from "react-dom"
import { createElement, FC, VFC } from "react"
import { ApolloProvider } from "@apollo/client"
import { Auth0Provider } from "@auth0/auth0-react"
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
import Authorization from "./pages/authorization"
import ApplySettings from "./components/apply-settings"

const Auth0: FC = ({ children }) => (
	<Auth0Provider
		children={children}
		domain={process.env.AUTH0_DOMAIN}
		redirectUri={window.location.origin}
		clientId={process.env.AUTH0_CLIENT_ID}
	/>
)

const Metadata: FC = ({ children }) => (
	<MetadataProvider appTitle={TITLE}>
		{children}
	</MetadataProvider>
)

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

const Root: VFC = () => (
	<Auth0>
		<Metadata>
			<ReactRedux>
				<ReactRouter>
					<ApolloClient>
						<ApplySettings>
							<Loading/>
							<Authorization>
								<Sidebar/>
								<Header/>
								<Pages/>
								<Bar/>
							</Authorization>
						</ApplySettings>
					</ApolloClient>
				</ReactRouter>
			</ReactRedux>
		</Metadata>
	</Auth0>
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