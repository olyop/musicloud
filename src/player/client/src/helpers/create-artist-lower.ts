import { isUndefined } from "lodash-es"

import { Artist } from "../types"
import { determinePlural } from "./determine-plural"

export const createArtistLower =
	({ albumsTotal, songsTotal }: Artist) => {
		if (typeof albumsTotal === undefined && typeof songsTotal === undefined) {
			return null
		} else {
			const albumsText = `${albumsTotal} album${determinePlural(albumsTotal)}`
			if (isUndefined(songsTotal)) {
				return albumsText
			} else {
				const songsText = `${songsTotal} song${determinePlural(songsTotal)}`
				return `${albumsText}, ${songsText}`
			}
		}
	}