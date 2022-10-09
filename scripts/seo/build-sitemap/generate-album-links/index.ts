import fs from "node:fs";
import path from "node:path";
import { EnumChangefreq } from "sitemap";

import pg from "../pg";
import { Link } from "../types";

const SELECT_ALBUMS = fs.readFileSync(path.join(__dirname, "select-albums.sql")).toString();

interface Album {
	album_id: string;
}

const generateAlbumLinks = async () => {
	const result = await pg.query<Album>(SELECT_ALBUMS);

	const albums = result.rows;

	const links = albums.map<Link>(({ album_id }) => ({
		url: `/album/${album_id}`,
		changefreq: EnumChangefreq.NEVER,
	}));

	return links;
};

export default generateAlbumLinks;
