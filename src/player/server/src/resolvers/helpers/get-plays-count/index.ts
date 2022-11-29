import { PoolOrClient, getResultCount, importSQL, query } from "@oly_op/pg-helpers";

const COUNT_PLAYS = await importSQL(import.meta.url)("select-plays-count");

export const getPlaysCount = (client: PoolOrClient) => () =>
	query(client)(COUNT_PLAYS)({
		parse: getResultCount,
	});
