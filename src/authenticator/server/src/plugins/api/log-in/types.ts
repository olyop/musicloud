import { AccessToken, UserEmailAddressBase, UserPasswordBase } from "@oly_op/musicloud-common/build/types"

interface Body
	extends UserEmailAddressBase, UserPasswordBase {}

export interface Route {
	Body: Body,
	Reply: AccessToken,
}