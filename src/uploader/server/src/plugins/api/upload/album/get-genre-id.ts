import { GenreID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, convertFirstRowToCamelCase, query } from "@oly_op/pg-helpers";
import { trim } from "lodash-es";
import { pipe } from "rxjs";

import { SELECT_GENRE } from "./sql.js";

const getGenreID = (pg: PoolOrClient) => (value: string) =>
	query(pg)(SELECT_GENRE)({
		parse: pipe(convertFirstRowToCamelCase<GenreID>(), ({ genreID }) => genreID),
		variables: [
			{
				key: "name",
				value: trim(value),
				parameterized: true,
			},
		],
	});

export default getGenreID;
