import { Workbox } from "workbox-window"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { createElement, StrictMode } from "react"
import { AudioPlayerProvider as AudioProvider } from "react-use-audio-player"

import {
	HeadProvider,
	ReduxProvider,
	ApolloProvider,
	LoadingProvider,
	SettingsProvider,
	AuthenticationProvider,
} from "./providers"

import Pages from "./pages"
import Bar from "./layouts/bar"
import Header from "./layouts/header"
import Sidebar from "./layouts/sidebar"

const rootElement =
	document.getElementById("Root")!

const root =
	createRoot(rootElement)

root.render(
	<StrictMode>
		<AudioProvider>
			<ReduxProvider>
				<BrowserRouter>
					<ApolloProvider>
						<LoadingProvider>
							<AuthenticationProvider>
								<SettingsProvider>
									<HeadProvider>
										<Sidebar/>
										<Header/>
										<Pages/>
										<Bar/>
									</HeadProvider>
								</SettingsProvider>
							</AuthenticationProvider>
						</LoadingProvider>
					</ApolloProvider>
				</BrowserRouter>
			</ReduxProvider>
		</AudioProvider>
	</StrictMode>,
)

if (process.env.SERVICE_WORKER === "true") {
	const workbox = new Workbox("/service-worker.js")
	void workbox.register()
}