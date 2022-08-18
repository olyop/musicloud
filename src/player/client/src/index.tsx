import { Workbox } from "workbox-window"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { createElement, StrictMode } from "react"
import { AudioPlayerProvider as AudioProvider } from "react-use-audio-player"

import {
	HeadProvider,
	ReduxProvider,
	ErrorProvider,
	ApolloProvider,
	LoadingProvider,
	SettingsProvider,
	AuthenticationProvider,
} from "./providers"

import Routes from "./routes"
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
						<ErrorProvider>
							<LoadingProvider>
								<AuthenticationProvider>
									<SettingsProvider>
										<HeadProvider>
											<Sidebar/>
											<Header/>
											<Routes/>
											<Bar/>
										</HeadProvider>
									</SettingsProvider>
								</AuthenticationProvider>
							</LoadingProvider>
						</ErrorProvider>
					</ApolloProvider>
				</BrowserRouter>
			</ReduxProvider>
		</AudioProvider>
	</StrictMode>,
)

if ("serviceWorker" in navigator && process.env.SERVICE_WORKER === "true") {
	const workbox = new Workbox("/service-worker.js")
	await workbox.register()
}