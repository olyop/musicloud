import { AccessToken, UserEmailAddressBase } from "@oly_op/musicloud-common/build/types";

interface Body extends UserEmailAddressBase {
	currentPassword: string;
	newPassword: string;
}

export interface Route {
	Body: Body;
	Reply: AccessToken;
}
