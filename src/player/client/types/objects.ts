import {
	KeyBase,
	UserBase,
	PlayBase,
	SongBase,
	AlbumBase,
	GenreBase,
	ArtistBase,
	UserIDBase,
	PlaylistBase,
} from "@oly_op/music-app-common/types"

export interface StoreObject<T = string> {
	__typename: T,
}

export interface Key extends KeyBase, StoreObject<"Key"> {}

export interface UserClientBase extends StoreObject<"User">, UserIDBase {}

export interface UserQueueNext {
	queueNext: Song[],
}

export interface UserQueueLater {
	queueLater: Song[],
}

export interface UserQueuePrevious {
	queuePrevious: Song[],
}

export interface UserQueues extends
	UserQueueNext,
	UserQueueLater,
	UserQueuePrevious {}

export interface UserNowPlaying {
	nowPlaying: Song | null,
}

export interface UserQueuesNowPlaying extends
	UserQueues,
	UserNowPlaying {}

export interface UserLibrary {
	librarySongs: Song[],
	libraryGenres: Genre[],
	libraryAlbums: Album[],
	libraryArtists: Artist[],
	libraryPlaylists: Playlist[],
	librarySongsTotal: number | null,
	libraryArtistsTotal: number | null,
}

export interface UserOther {
	playlists: Playlist[],
	playlistsFilteredBySong: Playlist[],
}

export interface User extends
	UserOther,
	UserLibrary,
	UserClientBase,
	UserQueuesNowPlaying,
	UserBase {}

export interface UserPartial extends
	Partial<Omit<User, keyof UserClientBase>>,
	UserClientBase {}

export interface Play extends PlayBase, StoreObject<"Play"> {
	user: User,
	song: Song,
}

export interface LibraryObject<T = string> extends StoreObject<T> {
	userPlays: Play[],
	playsTotal: number | null,
	userPlaysTotal: number | null,
}

export interface Genre extends GenreBase, LibraryObject<"Genre"> {
	songs: Song[],
	songsTotal: number | null,
	albumsTotal: number | null,
}

export interface Album extends AlbumBase, LibraryObject<"Album"> {
	songs: Song[],
	genres: Genre[],
	duration: number,
	released: string,
	artists: Artist[],
	songsTotal: number,
}

export interface InLibraryObject<T = string> extends LibraryObject<T> {
	inLibrary: boolean,
	dateAddedToLibrary: number | null,
}

export interface Artist extends ArtistBase, InLibraryObject<"Artist"> {
	city: string,
	songs: Song[],
	albums: Album[],
	country: string,
	songsTotal: number,
	albumsTotal: number,
	topTenSongs: Song[],
	firstAlbumReleaseDate: string,
}

export interface Song extends SongBase, InLibraryObject<"Song"> {
	key: Key,
	size: number,
	album: Album,
	genres: Genre[],
	artists: Artist[],
	remixers: Artist[],
	featuring: Artist[],
	queueIndex: number | null,
	dateAddedToPlaylist: number | null,
}

export interface Playlist extends PlaylistBase, InLibraryObject<"Playlist"> {
	user: User,
	songs: Song[],
	dateCreated: number,
	songsTotal: number | null,
}