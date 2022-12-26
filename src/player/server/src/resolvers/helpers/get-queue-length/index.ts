import { UserID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, getResultCount, importSQL, query } from "@oly_op/pg-helpers";

import { TableNameOptions } from "../../../types/index.js";

const SELECT_QUEUE_COUNT = await importSQL(import.meta.url)("select-queue-count");

export const getQueueLength =
	(pg: PoolOrClient) =>
	({ userID, tableName }: Options) =>
		query(pg)(SELECT_QUEUE_COUNT)({
			parse: getResultCount,
			variables: {
				userID,
				tableName: [tableName],
			},
		});

interface Options extends UserID, TableNameOptions {}
