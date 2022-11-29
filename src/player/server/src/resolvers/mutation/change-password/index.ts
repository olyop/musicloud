import { UserPasswordBase } from "@oly_op/musicloud-common/build/types";
import { importSQL, query } from "@oly_op/pg-helpers";
import { genSalt, hash } from "bcrypt";
import { isEmpty } from "lodash-es";

import resolver from "../resolver";

const hashPassword = async ({ password }: UserPasswordBase) => hash(password, await genSalt());

const UPDATE_USER_PASSWORD = await importSQL(import.meta.url)("update-user-password");

export const changePassword =
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	resolver<void, UserPasswordBase>(async ({ args, context }) => {
		const { password } = args;
		if (!isEmpty(password) && password.length >= 10) {
			await query(context.pg)(UPDATE_USER_PASSWORD)({
				variables: {
					password: [await hashPassword({ password }), [true]],
					userID: context.getAuthorizationJWTPayload(context.authorization).userID,
				},
			});
		} else {
			throw new Error("Invalid New Password");
		}
	});
