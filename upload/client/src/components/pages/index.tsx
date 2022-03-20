import { createElement, VFC } from "react"
import { Route, Routes, Navigate } from "react-router-dom"

import UserForm from "../user-form"
import GenreForm from "../genre-form"
import AlbumForm from "../album-form"
import ArtistForm from "../artist-form"

import "./index.scss"

const Pages: VFC = () => (
	<div className="Padding BodyOne Pages">
		<Routes>
			<Route
				path="*"
				element={(
					<Navigate
						replace
						to="user"
					/>
				)}
			/>
			<Route
				path="user"
				element={<UserForm/>}
			/>
			<Route
				path="genre"
				element={<GenreForm/>}
			/>
			<Route
				path="album"
				element={<AlbumForm/>}
			/>
			<Route
				path="artist"
				element={<ArtistForm/>}
			/>
		</Routes>
	</div>
)

export default Pages