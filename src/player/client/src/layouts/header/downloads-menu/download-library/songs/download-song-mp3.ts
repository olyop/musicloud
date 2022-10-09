import { SongID } from "@oly_op/musicloud-common/build/types";

import { createCatalogMP3URL } from "../../../../../helpers";

const downloadSongMP3 = async ({ songID }: SongID) => {
	await fetch(createCatalogMP3URL(songID));
};

export default downloadSongMP3;
