import { UserEmailAddressBase } from "@oly_op/musicloud-common/build/types";

interface Body extends UserEmailAddressBase {
	password: string;
}

interface Reply {
	success: boolean;
}

export interface Route {
	Body: Body;
	Reply: Reply;
}
