import { render } from "react-dom"
import { Workbox } from "workbox-window"
import { ApolloProvider } from "@apollo/client"
import { Provider as ReduxProvider } from "react-redux"
import { TITLE } from "@oly_op/music-app-common/metadata"
import { MetadataProvider } from "@oly_op/react-metadata"
import { createElement, FC, StrictMode, VFC } from "react"
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

const Application: VFC = () => (
	<StrictMode>
		<Loading/>
		<Sidebar/>
		<Header/>
		<Pages/>
		<Bar/>
	</StrictMode>
)

const Root: VFC = () => (
	<Metadata>
		<ReactRedux>
			<ReactRouter>
				<ApolloClient>
					<ApplySettings>
						<Authorization>
							<Application/>
						</Authorization>
					</ApplySettings>
				</ApolloClient>
			</ReactRouter>
		</ReactRedux>
	</Metadata>
)

const rootElement =
	document.getElementById("Root")

render(
	<Root/>,
	rootElement,
)

const workbox =
	new Workbox("/service-worker.js")

void workbox.register()