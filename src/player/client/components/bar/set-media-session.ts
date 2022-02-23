import noop from "lodash-es/noop"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import { Song } from "../../types"
import { createCatalogImageURL } from "../../helpers"

const formatItems =
	(items: string[]) => (
		items.length ?
			`${items.join(", ")} & ${items.pop()!}` :
			items.pop()!
	)

const setMediaSession =
	(song: Song) => {
		navigator.mediaSession.metadata =
			new MediaMetadata({
				title: song.title,
				album: song.album.title,
				artist: formatItems(song.artists.map(({ name }) => name)),
				artwork: [{
					type: "image/png",
					sizes: "306x306",
					src: createCatalogImageURL(
						song.album.albumID,
						"cover",
						ImageSizes.HALF,
						ImageDimensions.SQUARE,
					),
				}],
			})
		navigator.mediaSession.setActionHandler("play", noop)
		navigator.mediaSession.setActionHandler("pause", noop)
		navigator.mediaSession.setActionHandler("stop", noop)
		navigator.mediaSession.setActionHandler("seekbackward", noop)
		navigator.mediaSession.setActionHandler("seekforward", noop)
		navigator.mediaSession.setActionHandler("seekto", noop)
		navigator.mediaSession.setActionHandler("previoustrack", noop)
		navigator.mediaSession.setActionHandler("nexttrack", noop)
	}

export default setMediaSession