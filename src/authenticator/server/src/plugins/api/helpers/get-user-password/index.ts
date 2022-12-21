import { UserID, UserPasswordBase } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, convertFirstRowToCamelCase, importSQL, query } from "@oly_op/pg-helpers";
import { pipe } from "rxjs";

const SELECT_USER_PASSWORD = await importSQL(import.meta.url)("select-user-password");

export const getUserPassword =
	(pg: PoolOrClient) =>
	({ userID }: UserID) =>
		query(pg)(SELECT_USER_PASSWORD)({
			variables: { userID },
			parse: pipe(convertFirstRowToCamelCase<UserPasswordBase>(), ({ password }) => password),
		});
