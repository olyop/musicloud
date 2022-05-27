import { Workbox } from "workbox-window"
import { createRoot } from "react-dom/client"
import { ApolloProvider } from "@apollo/client"
import { createElement, FC, StrictMode } from "react"
import { Provider as ReduxProvider } from "react-redux"
import { BrowserRouter as Router } from "react-router-dom"
import { ChildrenProps, TITLE } from "@oly_op/musicloud-common"
import { AudioPlayerProvider as Audio } from "react-use-audio-player"
import { defaultParseTitleFunction, HeadProvider, HeadOnPageTitleChange } from "@oly_op/react-head"

import Pages from "./pages"
import client from "./apollo"
import Bar from "./components/bar"
import Header from "./components/header"
import Loading from "./components/loading"
import Sidebar from "./components/sidebar"
import Authorization from "./pages/authorization"
import ApplySettings from "./components/apply-settings"
import { store, updatePageTitle, useDispatch } from "./redux"

const Head: FC<ChildrenProps> = ({ children }) => {
	const dispatch = useDispatch()

	const handlePageTitleChange: HeadOnPageTitleChange =
		({ pageTitle }) => {
			dispatch(updatePageTitle(pageTitle))
		}

	return (
		<HeadProvider
			children={children}
			configuration={{
				title: TITLE,
				description: TITLE,
				parseTitle: defaultParseTitleFunction,
				onPageTitleChange: handlePageTitleChange,
			}}
		/>
	)
}

const Redux: FC<ChildrenProps> = ({ children }) => (
	<ReduxProvider store={store}>
		{children}
	</ReduxProvider>
)

const Apollo: FC<ChildrenProps> = ({ children }) => (
	<ApolloProvider client={client}>
		{children}
	</ApolloProvider>
)

const Root: FC = () => (
	<Redux>
		<Router>
			<Apollo>
				<Audio>
					<Loading>
						<Head>
							<ApplySettings>
								<Authorization>
									<Sidebar/>
									<Header/>
									<Pages/>
									<Bar/>
								</Authorization>
							</ApplySettings>
						</Head>
					</Loading>
				</Audio>
			</Apollo>
		</Router>
	</Redux>
)

const rootElement =
	document.getElementById("Root")!

const root =
	createRoot(rootElement)!

root.render((
	<StrictMode>
		<Root/>
	</StrictMode>
))

if (process.env.SERVICE_WORKER === "true") {
	const workbox = new Workbox("/service-worker.js")
	void workbox.register()
}