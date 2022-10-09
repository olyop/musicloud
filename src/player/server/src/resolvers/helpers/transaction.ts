import { query as pgHelpersQuery, exists as pgHelpersExists } from "@oly_op/pg-helpers";

import { Pool } from "pg";

interface Options {
	query: ReturnType<typeof pgHelpersQuery>;
	exists: ReturnType<typeof pgHelpersExists>;
}

type Work<T> = (options: Options) => Promise<T>;
type Rollback = (options: Options, error: unknown) => Promise<void>;

export const transaction =
	(pg: Pool) =>
	async <T>(work: Work<T>, rollback: Rollback): Promise<T> => {
		const client = await pg.connect();
		const query = pgHelpersQuery(client);
		const exists = pgHelpersExists(client);
		const options: Options = { query, exists };
		try {
			await query("BEGIN")();
			await work(options);
			return await query("COMMIT")();
		} catch (error) {
			await query("ROLLBACK")();
			await rollback(options, error);
			throw error;
		} finally {
			client.release();
		}
	};
