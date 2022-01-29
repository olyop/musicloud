import { UserIDNameBase } from "./objects";
export interface InterfaceWithInput<T> {
    input: T;
}
export interface JWTPayload extends UserIDNameBase {
    algoliaKey: string;
}
