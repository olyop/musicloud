import { ArtistID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, convertFirstRowToCamelCase, query } from "@oly_op/pg-helpers";
import { trim } from "lodash-es";
import { pipe } from "rxjs";

import { SELECT_ARTIST } from "./sql.js";

const getArtistID = (pg: PoolOrClient) => (value: string) =>
	query(pg)(SELECT_ARTIST)({
		parse: pipe(convertFirstRowToCamelCase<ArtistID>(), ({ artistID }) => artistID),
		variables: [
			{
				key: "name",
				value: trim(value),
				parameterized: true,
			},
		],
	});

export default getArtistID;
