import { isUndefined } from "lodash-es"

import { Artist } from "../types"
import { determinePlural } from "./determine-plural"

export const determineArtistLower =
	({ albumsTotal, songsTotal }: Artist) => {
		if (isUndefined(albumsTotal) && isUndefined(songsTotal)) {
			return undefined
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