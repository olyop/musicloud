import { SongID } from "@oly_op/musicloud-common"

import { createCatalogMP3URL } from "../../../../helpers"

const downloadSongMP3 =
	({ songID }: SongID) =>
		fetch(createCatalogMP3URL(songID))

export default downloadSongMP3