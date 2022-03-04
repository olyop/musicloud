import { pipe } from "rxjs"
import { trim } from "lodash-es"
import { ArtistID } from "@oly_op/music-app-common/types"
import { query, PoolOrClient, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import importSQL from "./import-sql"

const SELECT_ARTIST = importSQL("select-artist")

const getArtistID =
	(pg: PoolOrClient) =>
		(value: string) =>
			query(pg)(SELECT_ARTIST)({
				parse: pipe(
					convertFirstRowToCamelCase<ArtistID>(),
					({ artistID }) => artistID,
				),
				variables: [{
					key: "name",
					value: trim(value),
					parameterized: true,
				}],
			})

export default getArtistID