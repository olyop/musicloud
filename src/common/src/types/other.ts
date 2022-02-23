import { UserBase } from "./objects"

export interface InterfaceWithInput<T> {
	input: T,
}

export interface JWTPayload extends UserBase {
	algoliaKey: string,
}