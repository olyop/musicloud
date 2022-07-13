import { Workbox } from "workbox-window"
import { createRoot } from "react-dom/client"
import { ApolloProvider } from "@apollo/client"
import { Provider as ReduxProvider } from "react-redux"
import { BrowserRouter as Router } from "react-router-dom"
import { AudioPlayerProvider as Audio } from "react-use-audio-player"
import { createElement, FC, StrictMode, PropsWithChildren } from "react"

import Pages from "./pages"
import client from "./apollo"
import { store } from "./redux"
import Bar from "./components/bar"
import Head from "./components/head"
import Header from "./components/header"
import Loading from "./components/loading"
import Sidebar from "./components/sidebar"
import ApplySettings from "./components/apply-settings"
import Authentication from "./components/authentication"

const Redux: FC<PropsWithChildren> = ({ children }) => (
	<ReduxProvider store={store}>
		{children}
	</ReduxProvider>
)

const Apollo: FC<PropsWithChildren> = ({ children }) => (
	<ApolloProvider client={client}>
		{children}
	</ApolloProvider>
)

const rootElement =
	document.getElementById("Root")!

const root =
	createRoot(rootElement)

root.render(
	<StrictMode>
		<Redux>
			<Router>
				<Apollo>
					<Audio>
						<Loading>
							<Head>
								<Authentication>
									<ApplySettings>
										<Sidebar/>
										<Header/>
										<Pages/>
										<Bar/>
									</ApplySettings>
								</Authentication>
							</Head>
						</Loading>
					</Audio>
				</Apollo>
			</Router>
		</Redux>
	</StrictMode>,
)

if (process.env.SERVICE_WORKER === "true") {
	const workbox = new Workbox("/service-worker.js")
	void workbox.register()
}