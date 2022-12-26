import { StrictMode, createElement } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AudioPlayerProvider as AudioProvider } from "react-use-audio-player";
import { Workbox } from "workbox-window";

import Bar from "./layouts/bar";
import Header from "./layouts/header";
import Sidebar from "./layouts/sidebar";
import {
	ApolloProvider,
	AuthenticationProvider,
	ErrorProvider,
	HeadProvider,
	LoadingProvider,
	ReduxProvider,
	SettingsProvider,
} from "./providers";
import Routes from "./routes";

const rootElement = document.getElementById("Root")!;

const root = createRoot(rootElement);

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
											<Sidebar />
											<Header />
											<Routes />
											<Bar />
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
);

if (process.env.SERVICE_WORKER === "true" && "serviceWorker" in navigator) {
	const workbox = new Workbox("/service-worker.js");
	await workbox.register();
}
