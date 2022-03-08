import { render } from "react-dom"
import { Workbox } from "workbox-window"
import { ApolloProvider } from "@apollo/client"
import { TITLE } from "@oly_op/musicloud-common"
import { Provider as ReduxProvider } from "react-redux"
import { MetadataProvider } from "@oly_op/react-metadata"
import { createElement, FC, StrictMode, VFC } from "react"
import { BrowserRouter as ReactRouter } from "react-router-dom"
import { AudioPlayerProvider as AudioPlayer } from "react-use-audio-player"

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

const Root: VFC = () => (
	<StrictMode>
		<ReactRedux>
			<ReactRouter>
				<ApolloClient>
					<AudioPlayer>
						<Loading>
							<Metadata>
								<ApplySettings>
									<Authorization>
										<Sidebar/>
										<Header/>
										<Pages/>
										<Bar/>
									</Authorization>
								</ApplySettings>
							</Metadata>
						</Loading>
					</AudioPlayer>
				</ApolloClient>
			</ReactRouter>
		</ReactRedux>
	</StrictMode>
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