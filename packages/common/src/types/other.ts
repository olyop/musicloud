import type { ReactNode } from "react"

import { UserIDNameBase, UserDateJoinedBase, UserEmailAddressBase } from "./objects"

export interface ChildrenProps {
	children?: ReactNode,
}

export interface InterfaceWithInput<T> {
	input: T,
}

export interface JWTPayloadAlgoliaKey {
	algoliaKey: string,
}

export interface JWTPayloadUser
	extends
	UserIDNameBase,
	UserDateJoinedBase,
	UserEmailAddressBase {}

export interface JWTPayload
	extends
	JWTPayloadUser,
	JWTPayloadAlgoliaKey {}