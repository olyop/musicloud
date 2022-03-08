import { pipe } from "rxjs"
import { trim } from "lodash-es"
import { GenreID } from "@oly_op/musicloud-common"
import { query, PoolOrClient, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import importSQL from "./import-sql"

const SELECT_GENRE = importSQL("select-genre")

const getGenreID =
	(pg: PoolOrClient) =>
		(value: string) =>
			query(pg)(SELECT_GENRE)({
				parse: pipe(
					convertFirstRowToCamelCase<GenreID>(),
					({ genreID }) => genreID,
				),
				variables: [{
					key: "name",
					value: trim(value),
					parameterized: true,
				}],
			})

export default getGenreID