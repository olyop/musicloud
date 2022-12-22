import { Hit, HitAlbum, HitArtist, HitGenre, HitPlaylist, HitSong, HitUser } from "./types";

export const isUser = (hit: Hit): hit is HitUser => hit.typeName === "User";

export const isSong = (hit: Hit): hit is HitSong => hit.typeName === "Song";

export const isGenre = (hit: Hit): hit is HitGenre => hit.typeName === "Genre";

export const isAlbum = (hit: Hit): hit is HitAlbum => hit.typeName === "Album";

export const isArtist = (hit: Hit): hit is HitArtist => hit.typeName === "Artist";

export const isPlaylist = (hit: Hit): hit is HitPlaylist => hit.typeName === "Playlist";
