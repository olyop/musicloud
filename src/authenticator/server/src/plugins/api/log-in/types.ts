import { AccessToken, UserEmailAddressBase, UserPasswordBase } from "@oly_op/musicloud-common"

interface Body
	extends UserEmailAddressBase, UserPasswordBase {}

export interface Route {
	Body: Body,
	Reply: AccessToken,
}