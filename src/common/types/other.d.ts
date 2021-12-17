import { ObjectID, ArtistIDNameBase, GenreIDNameBase } from "./objects";
export interface InterfaceWithInput<T> {
    input: T;
}
export interface AlgoliaRecord extends ObjectID {
    name: string;
    plays: number;
    image?: string;
    origin?: string;
    typeName: string;
    genres?: GenreIDNameBase[];
    artists?: ArtistIDNameBase[];
    remixers?: ArtistIDNameBase[];
    featuring?: ArtistIDNameBase[];
}
