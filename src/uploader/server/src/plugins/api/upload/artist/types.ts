import { ArtistBase, ArtistID } from "@oly_op/musicloud-common/build/types";

import { BodyEntry } from "../../types.js";

interface Body extends Omit<ArtistBase, "artistID"> {
	city?: string;
	country?: string;
	cover: BodyEntry[];
	profile: BodyEntry[];
}

export interface Route {
	Body: Body;
	Reply: ArtistID | string;
}
