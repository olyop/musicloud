export interface ObjectID {
    objectID: string;
}
export interface KeyID {
    keyID: string;
}
export interface UserID {
    userID: string;
}
export interface SongID {
    songID: string;
}
export interface PlayID {
    playID: string;
}
export interface AlbumID {
    albumID: string;
}
export interface GenreID {
    genreID: string;
}
export interface ArtistID {
    artistID: string;
}
export interface PlaylistID {
    playlistID: string;
}
export interface KeyBase extends KeyID {
    flat: string;
    sharp: string;
    camelot: string;
}
export interface UserIDNameBase extends UserID {
    name: string;
}
export interface UserBase extends UserIDNameBase {
    dateJoined: number;
}
export interface SongIDTitleBase extends SongID {
    title: string;
}
export interface SongBase extends SongIDTitleBase {
    mix: string;
    bpm: string;
    duration: number;
    discNumber: number;
    trackNumber: number;
}
export interface PlayBase extends PlayID {
    dateCreated: number;
}
export interface AlbumIDTitleBase extends AlbumID {
    title: string;
}
export declare type AlbumBase = AlbumIDTitleBase;
export interface GenreIDNameBase extends GenreID {
    name: string;
}
export declare type GenreBase = GenreIDNameBase;
export interface ArtistIDNameBase extends ArtistID {
    name: string;
}
export interface ArtistBase extends ArtistIDNameBase {
    city: string;
    country: string;
}
export declare enum PlaylistPrivacy {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    FRIENDS = "FRIENDS"
}
export interface PlaylistIDTitleBase extends PlaylistID {
    title: string;
}
export interface PlaylistBase extends PlaylistIDTitleBase {
    dateCreated: number;
    privacy: PlaylistPrivacy;
}
