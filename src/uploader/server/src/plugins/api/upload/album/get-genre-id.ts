import { pipe } from "rxjs";
import { trim } from "lodash-es";
import { GenreID } from "@oly_op/musicloud-common/build/types";
import { query, PoolOrClient, convertFirstRowToCamelCase } from "@oly_op/pg-helpers";

import { SELECT_GENRE } from "./sql";

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
