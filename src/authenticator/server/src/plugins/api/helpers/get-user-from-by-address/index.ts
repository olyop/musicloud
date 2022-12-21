import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { UserBase, UserEmailAddressBase } from "@oly_op/musicloud-common/build/types";
import {
	PoolOrClient,
	addPrefix,
	convertFirstRowToCamelCase,
	importSQL,
	query,
} from "@oly_op/pg-helpers";

const SELECT_USER_BY_EMAIL = await importSQL(import.meta.url)("select-user-by-email");

export const getUserByEmailAddress =
	(pg: PoolOrClient) =>
	({ emailAddress }: UserEmailAddressBase) =>
		query(pg)(SELECT_USER_BY_EMAIL)({
			parse: convertFirstRowToCamelCase<UserBase>(),
			variables: {
				emailAddress,
				columnNames: addPrefix(COLUMN_NAMES.USER),
			},
		});
