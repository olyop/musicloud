import { clearQueue } from "../../../helpers";
import resolver from "../../resolver";

export const clearQueues = resolver<Record<string, never>>(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);
	await clearQueue(context.pg)({ userID });
	return {};
});
