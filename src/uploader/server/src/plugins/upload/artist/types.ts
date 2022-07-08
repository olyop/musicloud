import { ArtistBase, ArtistID } from "@oly_op/musicloud-common"

import { BodyEntry } from "../../types"

interface Body extends Omit<ArtistBase, "artistID"> {
	city?: string,
	country?: string,
	cover: BodyEntry[],
	profile: BodyEntry[],
}

export interface Route {
	Body: Body,
	Reply: ArtistID,
}