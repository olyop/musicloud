import { UserIDNameBase, UserDateJoinedBase, UserEmailAddress } from "./objects";
export interface InterfaceWithInput<T> {
    input: T;
}
export interface JWTPayloadAlgoliaKey {
    algoliaKey: string;
}
export interface JWTPayloadUser extends UserIDNameBase, UserEmailAddress, UserDateJoinedBase {
}
export interface JWTPayload extends JWTPayloadUser, JWTPayloadAlgoliaKey {
}
