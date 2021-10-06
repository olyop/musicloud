import { createElement, FC } from "react"
import { Route, Redirect, Switch } from "react-router-dom"

import User from "../user"
import Genre from "../genre"
import Album from "../album"
import Artist from "../artist"

import "./index.scss"

const Pages: FC = () => (
	<div className="Padding BodyOne Pages">
		<Switch>
			<Redirect
				exact
				from="/"
				to="/artist"
			/>
			<Route
				exact
				path="/user"
				component={User}
			/>
			<Route
				exact
				path="/genre"
				component={Genre}
			/>
			<Route
				exact
				path="/artist"
				component={Artist}
			/>
			<Route
				exact
				path="/album"
				component={Album}
			/>
		</Switch>
	</div>
)

export default Pages