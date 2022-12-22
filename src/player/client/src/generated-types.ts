/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable import/newline-after-import */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-invalid-void-type */

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	Date: string;
	EmailAddress: string;
	NonEmptyString: number;
	NonNegativeInt: number;
	PositiveInt: number;
	TimeStamp: number;
	UUID: string;
	Void: void;
};

export type Album = {
	__typename?: "Album";
	albumID: Scalars["UUID"];
	artists: Array<Artist>;
	duration: Scalars["PositiveInt"];
	genres: Array<Genre>;
	inLibrary: Scalars["Boolean"];
	playsTotal?: Maybe<Scalars["PositiveInt"]>;
	released: Scalars["TimeStamp"];
	remixers: Array<Artist>;
	songs: Array<Song>;
	songsTotal: Scalars["PositiveInt"];
	title: Scalars["NonEmptyString"];
	userPlaysTotal?: Maybe<Scalars["PositiveInt"]>;
};

export enum AlbumsOrderByField {
	Released = "RELEASED",
	Title = "TITLE",
}

export type AlbumsOrderByInput = {
	direction: OrderByDirection;
	field: AlbumsOrderByField;
};

export type Artist = {
	__typename?: "Artist";
	albums: Array<Album>;
	albumsTotal: Scalars["PositiveInt"];
	artistID: Scalars["UUID"];
	city?: Maybe<Scalars["NonEmptyString"]>;
	country?: Maybe<Scalars["NonEmptyString"]>;
	dateAddedToLibrary?: Maybe<Scalars["TimeStamp"]>;
	inLibrary: Scalars["Boolean"];
	name: Scalars["NonEmptyString"];
	playsTotal?: Maybe<Scalars["PositiveInt"]>;
	since: Scalars["TimeStamp"];
	songs: Array<Song>;
	songsTotal: Scalars["PositiveInt"];
	topTenSongs: Array<Song>;
	userPlaysTotal?: Maybe<Scalars["PositiveInt"]>;
};

export type ArtistAlbumsArgs = {
	orderBy: AlbumsOrderByInput;
};

export type ArtistSongsArgs = {
	orderBy: SongsOrderByInput;
};

export type CreatePlaylistInput = {
	privacy: PlaylistPrivacy;
	title: Scalars["NonEmptyString"];
};

export type Genre = {
	__typename?: "Genre";
	genreID: Scalars["UUID"];
	name: Scalars["NonEmptyString"];
	playsTotal?: Maybe<Scalars["PositiveInt"]>;
	songs: Array<Song>;
	songsTotal?: Maybe<Scalars["PositiveInt"]>;
	userPlaysTotal?: Maybe<Scalars["PositiveInt"]>;
};

export type GenreSongsArgs = {
	orderBy: SongsOrderByInput;
};

export enum GenresOrderByField {
	Name = "NAME",
}

export type GenresOrderByInput = {
	direction: OrderByDirection;
	field: GenresOrderByField;
};

export type GetSearchResultsInput = {
	length: Scalars["NonNegativeInt"];
	value: Scalars["NonEmptyString"];
};

export type Key = {
	__typename?: "Key";
	camelot: Scalars["NonEmptyString"];
	flat: Scalars["NonEmptyString"];
	keyID: Scalars["UUID"];
	sharp: Scalars["NonEmptyString"];
};

export type Library = {
	__typename?: "Library";
	albumAtIndex?: Maybe<Album>;
	albumsTotal?: Maybe<Scalars["NonNegativeInt"]>;
	artistAtIndex?: Maybe<Artist>;
	artistsTotal?: Maybe<Scalars["NonNegativeInt"]>;
	duration?: Maybe<Scalars["PositiveInt"]>;
	genreAtIndex?: Maybe<Genre>;
	genresTotal?: Maybe<Scalars["NonNegativeInt"]>;
	playlistAtIndex?: Maybe<Playlist>;
	playlistsTotal?: Maybe<Scalars["NonNegativeInt"]>;
	songAtIndex?: Maybe<Song>;
	songsTotal?: Maybe<Scalars["NonNegativeInt"]>;
};

export type LibraryAlbumAtIndexArgs = {
	input: LibraryAlbumAtIndexInput;
};

export type LibraryArtistAtIndexArgs = {
	input: LibraryArtistAtIndexInput;
};

export type LibraryGenreAtIndexArgs = {
	input: LibraryGenreAtIndexInput;
};

export type LibraryPlaylistAtIndexArgs = {
	input: LibraryPlaylistAtIndexInput;
};

export type LibrarySongAtIndexArgs = {
	input: LibrarySongAtIndexInput;
};

export type LibraryAlbumAtIndexInput = {
	atIndex: Scalars["NonNegativeInt"];
	orderBy: AlbumsOrderByInput;
};

export type LibraryArtistAtIndexInput = {
	atIndex: Scalars["NonNegativeInt"];
	orderBy: LibraryArtistsOrderByInput;
};

export enum LibraryArtistsOrderByField {
	DateAdded = "DATE_ADDED",
	Name = "NAME",
}

export type LibraryArtistsOrderByInput = {
	direction: OrderByDirection;
	field: LibraryArtistsOrderByField;
};

export type LibraryGenreAtIndexInput = {
	atIndex: Scalars["NonNegativeInt"];
	orderBy: GenresOrderByInput;
};

export type LibraryPlaylistAtIndexInput = {
	atIndex: Scalars["NonNegativeInt"];
	orderBy: LibraryPlaylistsOrderByInput;
};

export enum LibraryPlaylistsOrderByField {
	DateAdded = "DATE_ADDED",
	Title = "TITLE",
}

export type LibraryPlaylistsOrderByInput = {
	direction: OrderByDirection;
	field: LibraryPlaylistsOrderByField;
};

export type LibrarySongAtIndexInput = {
	atIndex: Scalars["NonNegativeInt"];
	orderBy: LibrarySongsOrderByInput;
};

export enum LibrarySongsOrderByField {
	Album = "ALBUM",
	DateAdded = "DATE_ADDED",
	Duration = "DURATION",
	Released = "RELEASED",
	Title = "TITLE",
}

export type LibrarySongsOrderByInput = {
	direction: OrderByDirection;
	field: LibrarySongsOrderByField;
};

export type Mutation = {
	__typename?: "Mutation";
	addAlbumToLibrary: Album;
	addAlbumToPlaylist: Playlist;
	addArtistToLibrary: Artist;
	addCatalogToLibrary?: Maybe<Scalars["Void"]>;
	addPlaylistToLibrary: Playlist;
	addSongToLibrary: Song;
	addSongToPlaylist: Playlist;
	clearNextQueues: Queue;
	clearQueues: Queue;
	createPlaylist: Playlist;
	deleteLibrary?: Maybe<Scalars["Void"]>;
	deletePlaylistByID?: Maybe<Scalars["Void"]>;
	followUser: User;
	jumpToSongInQueueLater: Queue;
	jumpToSongInQueueNext: Queue;
	nextQueueSong: Queue;
	playAlbum: Queue;
	playLibrary: Queue;
	playPlaylist: Queue;
	playSong: Queue;
	playTopOneHundredSongs: Queue;
	previousQueueSong: Queue;
	queueSongAfter: Queue;
	queueSongLater: Queue;
	queueSongNext: Queue;
	removeAlbumFromLibrary: Album;
	removeArtistFromLibrary: Artist;
	removePlaylistFromLibrary: Playlist;
	removeSongFromLibrary: Song;
	removeSongFromPlaylist: Playlist;
	removeSongFromQueueLater: Queue;
	removeSongFromQueueNext: Queue;
	shuffleAlbum: Queue;
	shuffleArtist: Queue;
	shuffleLibrary: Queue;
	shuffleLibraryCustom: Queue;
	shuffleNextAndLater: Queue;
	shufflePlaylist: Queue;
	shuffleTopOneHundredSongs: Queue;
	test?: Maybe<Scalars["Void"]>;
	unFollowUser: User;
	updatePlaylistPrivacy: Playlist;
	updatePlaylistTitle: Playlist;
};

export type MutationAddAlbumToLibraryArgs = {
	albumID: Scalars["UUID"];
};

export type MutationAddAlbumToPlaylistArgs = {
	albumID: Scalars["UUID"];
	playlistID: Scalars["UUID"];
};

export type MutationAddArtistToLibraryArgs = {
	artistID: Scalars["UUID"];
};

export type MutationAddPlaylistToLibraryArgs = {
	playlistID: Scalars["UUID"];
};

export type MutationAddSongToLibraryArgs = {
	songID: Scalars["UUID"];
};

export type MutationAddSongToPlaylistArgs = {
	playlistID: Scalars["UUID"];
	songID: Scalars["UUID"];
};

export type MutationCreatePlaylistArgs = {
	input: CreatePlaylistInput;
};

export type MutationDeletePlaylistByIdArgs = {
	playlistID: Scalars["UUID"];
};

export type MutationFollowUserArgs = {
	userID: Scalars["UUID"];
};

export type MutationJumpToSongInQueueLaterArgs = {
	index: Scalars["NonNegativeInt"];
};

export type MutationJumpToSongInQueueNextArgs = {
	index: Scalars["NonNegativeInt"];
};

export type MutationPlayAlbumArgs = {
	albumID: Scalars["UUID"];
};

export type MutationPlayPlaylistArgs = {
	playlistID: Scalars["UUID"];
};

export type MutationPlaySongArgs = {
	songID: Scalars["UUID"];
};

export type MutationQueueSongAfterArgs = {
	songID: Scalars["UUID"];
};

export type MutationQueueSongLaterArgs = {
	songID: Scalars["UUID"];
};

export type MutationQueueSongNextArgs = {
	songID: Scalars["UUID"];
};

export type MutationRemoveAlbumFromLibraryArgs = {
	albumID: Scalars["UUID"];
};

export type MutationRemoveArtistFromLibraryArgs = {
	artistID: Scalars["UUID"];
};

export type MutationRemovePlaylistFromLibraryArgs = {
	playlistID: Scalars["UUID"];
};

export type MutationRemoveSongFromLibraryArgs = {
	songID: Scalars["UUID"];
};

export type MutationRemoveSongFromPlaylistArgs = {
	index: Scalars["NonNegativeInt"];
	playlistID: Scalars["UUID"];
};

export type MutationRemoveSongFromQueueLaterArgs = {
	index: Scalars["NonNegativeInt"];
};

export type MutationRemoveSongFromQueueNextArgs = {
	index: Scalars["NonNegativeInt"];
};

export type MutationShuffleAlbumArgs = {
	albumID: Scalars["UUID"];
};

export type MutationShuffleArtistArgs = {
	artistID: Scalars["UUID"];
};

export type MutationShuffleLibraryCustomArgs = {
	input: ShuffleLibraryCustomInput;
};

export type MutationShufflePlaylistArgs = {
	playlistID: Scalars["UUID"];
};

export type MutationUnFollowUserArgs = {
	userID: Scalars["UUID"];
};

export type MutationUpdatePlaylistPrivacyArgs = {
	input: UpdatePlaylistPrivacyInput;
};

export type MutationUpdatePlaylistTitleArgs = {
	input: UpdatePlaylistTitleInput;
};

export enum OrderByDirection {
	Asc = "ASC",
	Desc = "DESC",
}

export type Play = {
	__typename?: "Play";
	dateCreated: Scalars["TimeStamp"];
	playID: Scalars["UUID"];
	song: Song;
	user: User;
};

export type Playlist = {
	__typename?: "Playlist";
	dateAddedToLibrary?: Maybe<Scalars["TimeStamp"]>;
	dateCreated: Scalars["TimeStamp"];
	duration?: Maybe<Scalars["PositiveInt"]>;
	inLibrary: Scalars["Boolean"];
	playlistID: Scalars["UUID"];
	playsTotal?: Maybe<Scalars["PositiveInt"]>;
	privacy: PlaylistPrivacy;
	songs?: Maybe<Array<Song>>;
	songsTotal?: Maybe<Scalars["PositiveInt"]>;
	title: Scalars["NonEmptyString"];
	user: User;
	userPlaysTotal?: Maybe<Scalars["PositiveInt"]>;
};

export enum PlaylistPrivacy {
	Followers = "FOLLOWERS",
	Private = "PRIVATE",
	Public = "PUBLIC",
}

export type Query = {
	__typename?: "Query";
	getAlbumByID: Album;
	getArtistByID: Artist;
	getGenreByID: Genre;
	getLibrary: Library;
	getPlayByID: Play;
	getPlaylistByID: Playlist;
	getPlaysTotal: Scalars["NonNegativeInt"];
	getQueue: Queue;
	getSongByID: Song;
	getTopOneHundredSongs: Array<Song>;
	getTopTenSongs: Array<Song>;
	getTrendingAlbums: Array<Album>;
	getTrendingArtists: Array<Artist>;
	getTrendingPlaylists: Array<Playlist>;
	getTrendingSongs: Array<Song>;
	getUser: User;
	getUserByID: User;
};

export type QueryGetAlbumByIdArgs = {
	albumID: Scalars["UUID"];
};

export type QueryGetArtistByIdArgs = {
	artistID: Scalars["UUID"];
};

export type QueryGetGenreByIdArgs = {
	genreID: Scalars["UUID"];
};

export type QueryGetPlayByIdArgs = {
	playID: Scalars["UUID"];
};

export type QueryGetPlaylistByIdArgs = {
	playlistID: Scalars["UUID"];
};

export type QueryGetSongByIdArgs = {
	songID: Scalars["UUID"];
};

export type QueryGetUserByIdArgs = {
	userID: Scalars["UUID"];
};

export type Queue = {
	__typename?: "Queue";
	later?: Maybe<Array<Song>>;
	next?: Maybe<Array<Song>>;
	nowPlaying?: Maybe<Song>;
	previous?: Maybe<Array<Song>>;
};

export type ShuffleLibraryCustomInput = {
	artists?: InputMaybe<Array<Scalars["UUID"]>>;
	genres?: InputMaybe<Array<Scalars["UUID"]>>;
};

export type Song = {
	__typename?: "Song";
	album: Album;
	artists: Array<Artist>;
	bpm: Scalars["PositiveInt"];
	dateAddedToLibrary?: Maybe<Scalars["TimeStamp"]>;
	dateAddedToPlaylist?: Maybe<Scalars["TimeStamp"]>;
	discNumber: Scalars["PositiveInt"];
	duration: Scalars["PositiveInt"];
	featuring: Array<Artist>;
	genres: Array<Genre>;
	inLibrary: Scalars["Boolean"];
	isInPlaylist: Scalars["Boolean"];
	key: Key;
	mix: Scalars["String"];
	playlistIndex?: Maybe<Scalars["NonNegativeInt"]>;
	playsTotal?: Maybe<Scalars["PositiveInt"]>;
	queueIndex?: Maybe<Scalars["NonNegativeInt"]>;
	remixers: Array<Artist>;
	size: Scalars["PositiveInt"];
	songID: Scalars["UUID"];
	title: Scalars["NonEmptyString"];
	trackNumber: Scalars["PositiveInt"];
	userPlaysTotal?: Maybe<Scalars["PositiveInt"]>;
};

export type SongDateAddedToPlaylistArgs = {
	playlistID: Scalars["UUID"];
};

export type SongIsInPlaylistArgs = {
	playlistID: Scalars["UUID"];
};

export type SongPlaylistIndexArgs = {
	playlistID: Scalars["UUID"];
};

export enum SongsOrderByField {
	Album = "ALBUM",
	Duration = "DURATION",
	Released = "RELEASED",
	Title = "TITLE",
}

export type SongsOrderByInput = {
	direction: OrderByDirection;
	field: SongsOrderByField;
};

export type UpdatePlaylistPrivacyInput = {
	playlistID: Scalars["UUID"];
	privacy: PlaylistPrivacy;
};

export type UpdatePlaylistTitleInput = {
	playlistID: Scalars["UUID"];
	title: Scalars["NonEmptyString"];
};

export type User = {
	__typename?: "User";
	dateJoined: Scalars["TimeStamp"];
	emailAddress: Scalars["EmailAddress"];
	followers?: Maybe<Array<User>>;
	isFollower: Scalars["Boolean"];
	isFollowing: Scalars["Boolean"];
	name: Scalars["NonEmptyString"];
	playlists?: Maybe<Array<Playlist>>;
	playlistsFilteredBySong?: Maybe<Array<Playlist>>;
	playlistsTotal?: Maybe<Scalars["PositiveInt"]>;
	playsTotal?: Maybe<Scalars["PositiveInt"]>;
	userID: Scalars["UUID"];
};

export type UserPlaylistsFilteredBySongArgs = {
	songID: Scalars["UUID"];
};
