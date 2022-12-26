import { clearQueue } from "../../../helpers/index.js";
import resolver from "../../resolver.js";

export const clearQueues = resolver<Record<string, never>>(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);
	await clearQueue(context.pg)({ userID });
	return {};
});
