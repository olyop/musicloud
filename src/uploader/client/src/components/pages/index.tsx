import { FC, createElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AlbumForm from "../album-form";
import ArtistForm from "../artist-form";
import GenreForm from "../genre-form";
import "./index.scss";

const Pages: FC = () => (
	<div className="Padding ParagraphOne Pages">
		<Routes>
			<Route path="*" element={<Navigate replace to="album" />} />
			<Route path="genre" element={<GenreForm />} />
			<Route path="album" element={<AlbumForm />} />
			<Route path="artist" element={<ArtistForm />} />
		</Routes>
	</div>
);

export default Pages;
