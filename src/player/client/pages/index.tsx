import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"
import { Switch, Route } from "react-router-dom"

import routes from "./routes"

import "./index.scss"

const bem =
	createBEM("Pages")

const Pages: FC = () => (
	<main className={bem("")}>
		<Switch>
			{routes.map(
				({ routeID, path, exact, component }) => (
					<Route
						path={path}
						key={routeID}
						exact={exact}
						component={component}
					/>
				),
			)}
		</Switch>
	</main>
)

export default Pages