import { UserDateJoinedBase, UserEmailAddressBase, UserIDNameBase } from "./objects/index.js";

export interface InterfaceWithInput<T> {
	input: T;
}

export interface JWTPayloadAlgoliaKey {
	algoliaKey: string;
}

export interface JWTPayloadUser extends UserIDNameBase, UserDateJoinedBase, UserEmailAddressBase {}

export interface JWTPayload extends JWTPayloadUser, JWTPayloadAlgoliaKey {}

export interface AccessToken {
	accessToken: string;
}

export enum ServicesNames {
	PLAYER = "player",
	UPLOADER = "uploader",
	AUTHENTICATOR = "authenticator",
}
