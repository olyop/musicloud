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
	readonly __typename: "Album";
	readonly albumID: Scalars["UUID"];
	readonly artists: ReadonlyArray<Artist>;
	readonly duration: Scalars["PositiveInt"];
	readonly genres: ReadonlyArray<Genre>;
	readonly inLibrary: Scalars["Boolean"];
	readonly playsTotal: Maybe<Scalars["PositiveInt"]>;
	readonly released: Scalars["TimeStamp"];
	readonly remixers: ReadonlyArray<Artist>;
	readonly songs: ReadonlyArray<Song>;
	readonly songsTotal: Scalars["PositiveInt"];
	readonly title: Scalars["NonEmptyString"];
	readonly userPlaysTotal: Maybe<Scalars["PositiveInt"]>;
};

export enum AlbumsOrderByField {
	RELEASED = "RELEASED",
	TITLE = "TITLE",
}

export type AlbumsOrderByInput = {
	readonly direction: OrderByDirection;
	readonly field: AlbumsOrderByField;
};

export type Artist = {
	readonly __typename: "Artist";
	readonly albums: ReadonlyArray<Album>;
	readonly albumsTotal: Scalars["PositiveInt"];
	readonly artistID: Scalars["UUID"];
	readonly city: Maybe<Scalars["NonEmptyString"]>;
	readonly country: Maybe<Scalars["NonEmptyString"]>;
	readonly dateAddedToLibrary: Maybe<Scalars["TimeStamp"]>;
	readonly inLibrary: Scalars["Boolean"];
	readonly name: Scalars["NonEmptyString"];
	readonly playsTotal: Maybe<Scalars["PositiveInt"]>;
	readonly since: Scalars["TimeStamp"];
	readonly songs: ReadonlyArray<Song>;
	readonly songsTotal: Scalars["PositiveInt"];
	readonly topTenSongs: ReadonlyArray<Song>;
	readonly userPlaysTotal: Maybe<Scalars["PositiveInt"]>;
};

export type ArtistAlbumsArgs = {
	orderBy: AlbumsOrderByInput;
};

export type ArtistSongsArgs = {
	orderBy: SongsOrderByInput;
};

export type CreatePlaylistInput = {
	readonly privacy: PlaylistPrivacy;
	readonly title: Scalars["NonEmptyString"];
};

export type Genre = {
	readonly __typename: "Genre";
	readonly genreID: Scalars["UUID"];
	readonly name: Scalars["NonEmptyString"];
	readonly playsTotal: Maybe<Scalars["PositiveInt"]>;
	readonly songs: ReadonlyArray<Song>;
	readonly songsTotal: Maybe<Scalars["PositiveInt"]>;
	readonly userPlaysTotal: Maybe<Scalars["PositiveInt"]>;
};

export type GenreSongsArgs = {
	orderBy: SongsOrderByInput;
};

export enum GenresOrderByField {
	NAME = "NAME",
}

export type GenresOrderByInput = {
	readonly direction: OrderByDirection;
	readonly field: GenresOrderByField;
};

export type Key = {
	readonly __typename: "Key";
	readonly camelot: Scalars["NonEmptyString"];
	readonly flat: Scalars["NonEmptyString"];
	readonly keyID: Scalars["UUID"];
	readonly sharp: Scalars["NonEmptyString"];
};

export type Library = {
	readonly __typename: "Library";
	readonly albumAtIndex: Maybe<Album>;
	readonly albumsTotal: Maybe<Scalars["NonNegativeInt"]>;
	readonly artistAtIndex: Maybe<Artist>;
	readonly artistsTotal: Maybe<Scalars["NonNegativeInt"]>;
	readonly duration: Maybe<Scalars["PositiveInt"]>;
	readonly genreAtIndex: Maybe<Genre>;
	readonly genresTotal: Maybe<Scalars["NonNegativeInt"]>;
	readonly playlistAtIndex: Maybe<Playlist>;
	readonly playlistsTotal: Maybe<Scalars["NonNegativeInt"]>;
	readonly songAtIndex: Maybe<Song>;
	readonly songsTotal: Maybe<Scalars["NonNegativeInt"]>;
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
	readonly atIndex: Scalars["NonNegativeInt"];
	readonly orderBy: AlbumsOrderByInput;
};

export type LibraryArtistAtIndexInput = {
	readonly atIndex: Scalars["NonNegativeInt"];
	readonly orderBy: LibraryArtistsOrderByInput;
};

export enum LibraryArtistsOrderByField {
	DATE_ADDED = "DATE_ADDED",
	NAME = "NAME",
}

export type LibraryArtistsOrderByInput = {
	readonly direction: OrderByDirection;
	readonly field: LibraryArtistsOrderByField;
};

export type LibraryGenreAtIndexInput = {
	readonly atIndex: Scalars["NonNegativeInt"];
	readonly orderBy: GenresOrderByInput;
};

export type LibraryPlaylistAtIndexInput = {
	readonly atIndex: Scalars["NonNegativeInt"];
	readonly orderBy: LibraryPlaylistsOrderByInput;
};

export enum LibraryPlaylistsOrderByField {
	DATE_ADDED = "DATE_ADDED",
	TITLE = "TITLE",
}

export type LibraryPlaylistsOrderByInput = {
	readonly direction: OrderByDirection;
	readonly field: LibraryPlaylistsOrderByField;
};

export type LibrarySongAtIndexInput = {
	readonly atIndex: Scalars["NonNegativeInt"];
	readonly orderBy: LibrarySongsOrderByInput;
};

export enum LibrarySongsOrderByField {
	ALBUM = "ALBUM",
	DATE_ADDED = "DATE_ADDED",
	DURATION = "DURATION",
	RELEASED = "RELEASED",
	TITLE = "TITLE",
}

export type LibrarySongsOrderByInput = {
	readonly direction: OrderByDirection;
	readonly field: LibrarySongsOrderByField;
};

export type Mutation = {
	readonly __typename: "Mutation";
	readonly addAlbumToLibrary: Album;
	readonly addAlbumToPlaylist: Playlist;
	readonly addArtistToLibrary: Artist;
	readonly addCatalogToLibrary: Maybe<Scalars["Void"]>;
	readonly addPlaylistToLibrary: Playlist;
	readonly addSongToLibrary: Song;
	readonly addSongToPlaylist: Playlist;
	readonly clearNextQueues: Queue;
	readonly clearQueues: Queue;
	readonly createPlaylist: Playlist;
	readonly deleteLibrary: Maybe<Scalars["Void"]>;
	readonly deletePlaylistByID: Scalars["Void"];
	readonly followUser: User;
	readonly jumpToSongInQueueLater: Queue;
	readonly jumpToSongInQueueNext: Queue;
	readonly nextQueueSong: Queue;
	readonly playAlbum: Queue;
	readonly playLibrary: Queue;
	readonly playPlaylist: Queue;
	readonly playSong: Queue;
	readonly playTopOneHundredSongs: Queue;
	readonly previousQueueSong: Queue;
	readonly queueSongAfter: Queue;
	readonly queueSongLater: Queue;
	readonly queueSongNext: Queue;
	readonly removeAlbumFromLibrary: Album;
	readonly removeArtistFromLibrary: Artist;
	readonly removePlaylistFromLibrary: Playlist;
	readonly removeSongFromLibrary: Song;
	readonly removeSongFromPlaylist: Playlist;
	readonly removeSongFromQueueLater: Queue;
	readonly removeSongFromQueueNext: Queue;
	readonly shuffleAlbum: Queue;
	readonly shuffleArtist: Queue;
	readonly shuffleLibrary: Queue;
	readonly shuffleLibraryCustom: Queue;
	readonly shuffleNextAndLater: Queue;
	readonly shufflePlaylist: Queue;
	readonly shuffleTopOneHundredSongs: Queue;
	readonly unFollowUser: User;
	readonly updatePlaylistPrivacy: Playlist;
	readonly updatePlaylistTitle: Playlist;
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
	ASC = "ASC",
	DESC = "DESC",
}

export type Play = {
	readonly __typename: "Play";
	readonly dateCreated: Scalars["TimeStamp"];
	readonly playID: Scalars["UUID"];
	readonly song: Song;
	readonly user: User;
};

export type Playlist = {
	readonly __typename: "Playlist";
	readonly dateAddedToLibrary: Maybe<Scalars["TimeStamp"]>;
	readonly dateCreated: Scalars["TimeStamp"];
	readonly duration: Maybe<Scalars["PositiveInt"]>;
	readonly inLibrary: Scalars["Boolean"];
	readonly playlistID: Scalars["UUID"];
	readonly playsTotal: Maybe<Scalars["PositiveInt"]>;
	readonly privacy: PlaylistPrivacy;
	readonly songs: Maybe<ReadonlyArray<Song>>;
	readonly songsTotal: Maybe<Scalars["PositiveInt"]>;
	readonly title: Scalars["NonEmptyString"];
	readonly user: User;
	readonly userPlaysTotal: Maybe<Scalars["PositiveInt"]>;
};

export enum PlaylistPrivacy {
	FOLLOWERS = "FOLLOWERS",
	PRIVATE = "PRIVATE",
	PUBLIC = "PUBLIC",
}

export type Query = {
	readonly __typename: "Query";
	readonly getAlbumByID: Album;
	readonly getArtistByID: Artist;
	readonly getGenreByID: Genre;
	readonly getLibrary: Library;
	readonly getPlayByID: Play;
	readonly getPlaylistByID: Playlist;
	readonly getPlaysTotal: Scalars["NonNegativeInt"];
	readonly getQueue: Queue;
	readonly getSongByID: Song;
	readonly getTopOneHundredSongs: ReadonlyArray<Song>;
	readonly getTopTenSongs: ReadonlyArray<Song>;
	readonly getTrendingAlbums: ReadonlyArray<Album>;
	readonly getTrendingArtists: ReadonlyArray<Artist>;
	readonly getTrendingPlaylists: ReadonlyArray<Playlist>;
	readonly getTrendingSongs: ReadonlyArray<Song>;
	readonly getUser: User;
	readonly getUserByID: User;
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
	readonly __typename: "Queue";
	readonly later: Maybe<ReadonlyArray<Song>>;
	readonly next: Maybe<ReadonlyArray<Song>>;
	readonly nowPlaying: Maybe<Song>;
	readonly previous: Maybe<ReadonlyArray<Song>>;
};

export type ShuffleLibraryCustomInput = {
	readonly artists: InputMaybe<ReadonlyArray<Scalars["UUID"]>>;
	readonly genres: InputMaybe<ReadonlyArray<Scalars["UUID"]>>;
};

export type Song = {
	readonly __typename: "Song";
	readonly album: Album;
	readonly artists: ReadonlyArray<Artist>;
	readonly bpm: Scalars["PositiveInt"];
	readonly dateAddedToLibrary: Maybe<Scalars["TimeStamp"]>;
	readonly dateAddedToPlaylist: Maybe<Scalars["TimeStamp"]>;
	readonly discNumber: Scalars["PositiveInt"];
	readonly duration: Scalars["PositiveInt"];
	readonly featuring: ReadonlyArray<Artist>;
	readonly genres: ReadonlyArray<Genre>;
	readonly inLibrary: Scalars["Boolean"];
	readonly isInPlaylist: Scalars["Boolean"];
	readonly key: Key;
	readonly mix: Scalars["String"];
	readonly playlistIndex: Maybe<Scalars["NonNegativeInt"]>;
	readonly playsTotal: Maybe<Scalars["PositiveInt"]>;
	readonly queueIndex: Maybe<Scalars["NonNegativeInt"]>;
	readonly remixers: ReadonlyArray<Artist>;
	readonly size: Scalars["PositiveInt"];
	readonly songID: Scalars["UUID"];
	readonly title: Scalars["NonEmptyString"];
	readonly trackNumber: Scalars["PositiveInt"];
	readonly userPlaysTotal: Maybe<Scalars["PositiveInt"]>;
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
	ALBUM = "ALBUM",
	DURATION = "DURATION",
	RELEASED = "RELEASED",
	TITLE = "TITLE",
}

export type SongsOrderByInput = {
	readonly direction: OrderByDirection;
	readonly field: SongsOrderByField;
};

export type UpdatePlaylistPrivacyInput = {
	readonly playlistID: Scalars["UUID"];
	readonly privacy: PlaylistPrivacy;
};

export type UpdatePlaylistTitleInput = {
	readonly playlistID: Scalars["UUID"];
	readonly title: Scalars["NonEmptyString"];
};

export type User = {
	readonly __typename: "User";
	readonly dateJoined: Scalars["TimeStamp"];
	readonly emailAddress: Scalars["EmailAddress"];
	readonly followers: Maybe<ReadonlyArray<User>>;
	readonly isFollower: Scalars["Boolean"];
	readonly isFollowing: Scalars["Boolean"];
	readonly name: Scalars["NonEmptyString"];
	readonly playlists: Maybe<ReadonlyArray<Playlist>>;
	readonly playlistsFilteredBySong: Maybe<ReadonlyArray<Playlist>>;
	readonly playlistsTotal: Maybe<Scalars["PositiveInt"]>;
	readonly playsTotal: Maybe<Scalars["PositiveInt"]>;
	readonly userID: Scalars["UUID"];
};

export type UserPlaylistsFilteredBySongArgs = {
	songID: Scalars["UUID"];
};

export type AddAlbumToPlaylistMutationVariables = Exact<{
	albumID: Scalars["UUID"];
	playlistID: Scalars["UUID"];
}>;

export type AddAlbumToPlaylistMutation = {
	readonly addAlbumToPlaylist: {
		readonly playlistID: string;
		readonly songsTotal: number | null;
		readonly songs: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly playlistIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Playlist" };
} & { readonly __typename: "Mutation" };

export type GetUserPlaylistsQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserPlaylistsQuery = {
	readonly getUser: {
		readonly userID: string;
		readonly playlists: ReadonlyArray<
			{
				readonly playlistID: string;
				readonly title: number;
				readonly songsTotal: number | null;
				readonly user: { readonly userID: string; readonly name: number } & {
					readonly __typename: "User";
				};
			} & { readonly __typename: "Playlist" }
		> | null;
	} & { readonly __typename: "User" };
} & { readonly __typename: "Query" };

export type AddSongToPlaylistMutationVariables = Exact<{
	songID: Scalars["UUID"];
	playlistID: Scalars["UUID"];
}>;

export type AddSongToPlaylistMutation = {
	readonly addSongToPlaylist: {
		readonly playlistID: string;
		readonly songsTotal: number | null;
		readonly songs: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly playlistIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Playlist" };
} & { readonly __typename: "Mutation" };

export type GetUserPlaylistsFilteredBySongQueryVariables = Exact<{
	songID: Scalars["UUID"];
}>;

export type GetUserPlaylistsFilteredBySongQuery = {
	readonly getUser: {
		readonly userID: string;
		readonly playlistsFilteredBySong: ReadonlyArray<
			{
				readonly playlistID: string;
				readonly title: number;
				readonly songsTotal: number | null;
				readonly user: { readonly userID: string; readonly name: number } & {
					readonly __typename: "User";
				};
			} & { readonly __typename: "Playlist" }
		> | null;
	} & { readonly __typename: "User" };
} & { readonly __typename: "Query" };

export type QueueSongAfterMutationVariables = Exact<{
	songID: Scalars["UUID"];
}>;

export type QueueSongAfterMutation = {
	readonly queueSongAfter: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type QueueSongLaterMutationVariables = Exact<{
	songID: Scalars["UUID"];
}>;

export type QueueSongLaterMutation = {
	readonly queueSongLater: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type QueueSongNextMutationVariables = Exact<{
	songID: Scalars["UUID"];
}>;

export type QueueSongNextMutation = {
	readonly queueSongNext: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type GetQueueNowPlayingQueryVariables = Exact<{ [key: string]: never }>;

export type GetQueueNowPlayingQuery = {
	readonly getQueue: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Query" };

export type WriteQueueNowPlayingQueryVariables = Exact<{ [key: string]: never }>;

export type WriteQueueNowPlayingQuery = {
	readonly getQueue: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Query" };

export type CreatePlaylistMutationVariables = Exact<{
	input: CreatePlaylistInput;
}>;

export type CreatePlaylistMutation = {
	readonly createPlaylist: { readonly playlistID: string } & { readonly __typename: "Playlist" };
} & { readonly __typename: "Mutation" };

export type DeletePlaylistMutationVariables = Exact<{
	playlistID: Scalars["UUID"];
}>;

export type DeletePlaylistMutation = { readonly deletePlaylistByID: void } & {
	readonly __typename: "Mutation";
};

export type NextQueueSongMutationVariables = Exact<{ [key: string]: never }>;

export type NextQueueSongMutation = {
	readonly nextQueueSong: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type GetAlbumNowPlayingQueryVariables = Exact<{ [key: string]: never }>;

export type GetAlbumNowPlayingQuery = {
	readonly getQueue: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly album: { readonly albumID: string } & { readonly __typename: "Album" };
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Query" };

export type PlayAlbumMutationVariables = Exact<{
	albumID: Scalars["UUID"];
}>;

export type PlayAlbumMutation = {
	readonly playAlbum: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type GetPlaylistNowPlayingQueryVariables = Exact<{
	playlistID: Scalars["UUID"];
}>;

export type GetPlaylistNowPlayingQuery = {
	readonly getQueue: {
		readonly nowPlaying:
			| ({ readonly songID: string; readonly isInPlaylist: boolean } & {
					readonly __typename: "Song";
			  })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Query" };

export type PlayPlaylistMutationVariables = Exact<{
	playlistID: Scalars["UUID"];
}>;

export type PlayPlaylistMutation = {
	readonly playPlaylist: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type GetQueueNowPlayingSongIdQueryVariables = Exact<{ [key: string]: never }>;

export type GetQueueNowPlayingSongIdQuery = {
	readonly getQueue: {
		readonly nowPlaying: ({ readonly songID: string } & { readonly __typename: "Song" }) | null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Query" };

export type PlaySongMutationVariables = Exact<{
	songID: Scalars["UUID"];
}>;

export type PlaySongMutation = {
	readonly playSong: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type PreviousQueueSongMutationVariables = Exact<{ [key: string]: never }>;

export type PreviousQueueSongMutation = {
	readonly previousQueueSong: {
		readonly previous: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
		readonly next: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
		readonly later: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type RemoveSongFromQueueLaterMutationVariables = Exact<{
	index: Scalars["NonNegativeInt"];
}>;

export type RemoveSongFromQueueLaterMutation = {
	readonly removeSongFromQueueLater: {
		readonly later: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type RemoveSongFromQueueNextMutationVariables = Exact<{
	index: Scalars["NonNegativeInt"];
}>;

export type RemoveSongFromQueueNextMutation = {
	readonly removeSongFromQueueNext: {
		readonly next: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
		readonly later: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type ShuffleAlbumMutationVariables = Exact<{
	albumID: Scalars["UUID"];
}>;

export type ShuffleAlbumMutation = {
	readonly shuffleAlbum: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type ShuffleArtistMutationVariables = Exact<{
	artistID: Scalars["UUID"];
}>;

export type ShuffleArtistMutation = {
	readonly shuffleArtist: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type ShufflePlaylistMutationVariables = Exact<{
	playlistID: Scalars["UUID"];
}>;

export type ShufflePlaylistMutation = {
	readonly shufflePlaylist: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type AddAlbumToLibraryMutationVariables = Exact<{
	albumID: Scalars["UUID"];
}>;

export type AddAlbumToLibraryMutation = {
	readonly addAlbumToLibrary: {
		readonly albumID: string;
		readonly inLibrary: boolean;
		readonly songs: ReadonlyArray<
			{ readonly songID: string; readonly inLibrary: boolean } & { readonly __typename: "Song" }
		>;
	} & { readonly __typename: "Album" };
} & { readonly __typename: "Mutation" };

export type GetAlbumInLibraryQueryVariables = Exact<{
	albumID: Scalars["UUID"];
}>;

export type GetAlbumInLibraryQuery = {
	readonly getAlbumByID: { readonly albumID: string; readonly inLibrary: boolean } & {
		readonly __typename: "Album";
	};
} & { readonly __typename: "Query" };

export type RemoveAlbumFromLibraryMutationVariables = Exact<{
	albumID: Scalars["UUID"];
}>;

export type RemoveAlbumFromLibraryMutation = {
	readonly removeAlbumFromLibrary: {
		readonly albumID: string;
		readonly inLibrary: boolean;
		readonly songs: ReadonlyArray<
			{ readonly songID: string; readonly inLibrary: boolean } & { readonly __typename: "Song" }
		>;
	} & { readonly __typename: "Album" };
} & { readonly __typename: "Mutation" };

export type AddArtistToLibraryMutationVariables = Exact<{
	artistID: Scalars["UUID"];
}>;

export type AddArtistToLibraryMutation = {
	readonly addArtistToLibrary: { readonly artistID: string; readonly inLibrary: boolean } & {
		readonly __typename: "Artist";
	};
} & { readonly __typename: "Mutation" };

export type AddPlaylistToLibraryMutationVariables = Exact<{
	playlistID: Scalars["UUID"];
}>;

export type AddPlaylistToLibraryMutation = {
	readonly addPlaylistToLibrary: { readonly inLibrary: boolean; readonly playlistID: string } & {
		readonly __typename: "Playlist";
	};
} & { readonly __typename: "Mutation" };

export type AddSongToLibraryMutationVariables = Exact<{
	songID: Scalars["UUID"];
}>;

export type AddSongToLibraryMutation = {
	readonly addSongToLibrary: { readonly songID: string; readonly inLibrary: boolean } & {
		readonly __typename: "Song";
	};
} & { readonly __typename: "Mutation" };

export type GetArtistInLibraryQueryVariables = Exact<{
	artistID: Scalars["UUID"];
}>;

export type GetArtistInLibraryQuery = {
	readonly getArtistByID: { readonly artistID: string; readonly inLibrary: boolean } & {
		readonly __typename: "Artist";
	};
} & { readonly __typename: "Query" };

export type GetPlaylistInLibraryQueryVariables = Exact<{
	playlistID: Scalars["UUID"];
}>;

export type GetPlaylistInLibraryQuery = {
	readonly getPlaylistByID: { readonly inLibrary: boolean; readonly playlistID: string } & {
		readonly __typename: "Playlist";
	};
} & { readonly __typename: "Query" };

export type GetSongInLibraryQueryVariables = Exact<{
	songID: Scalars["UUID"];
}>;

export type GetSongInLibraryQuery = {
	readonly getSongByID: { readonly songID: string; readonly inLibrary: boolean } & {
		readonly __typename: "Song";
	};
} & { readonly __typename: "Query" };

export type RemoveArtistFromLibraryMutationVariables = Exact<{
	artistID: Scalars["UUID"];
}>;

export type RemoveArtistFromLibraryMutation = {
	readonly removeArtistFromLibrary: { readonly artistID: string; readonly inLibrary: boolean } & {
		readonly __typename: "Artist";
	};
} & { readonly __typename: "Mutation" };

export type RemovePlaylistFromLibraryMutationVariables = Exact<{
	playlistID: Scalars["UUID"];
}>;

export type RemovePlaylistFromLibraryMutation = {
	readonly removePlaylistFromLibrary: {
		readonly inLibrary: boolean;
		readonly playlistID: string;
	} & { readonly __typename: "Playlist" };
} & { readonly __typename: "Mutation" };

export type RemoveSongFromLibraryMutationVariables = Exact<{
	songID: Scalars["UUID"];
}>;

export type RemoveSongFromLibraryMutation = {
	readonly removeSongFromLibrary: { readonly songID: string; readonly inLibrary: boolean } & {
		readonly __typename: "Song";
	};
} & { readonly __typename: "Mutation" };

export type FollowUserMutationVariables = Exact<{
	userID: Scalars["UUID"];
}>;

export type FollowUserMutation = {
	readonly followUser: { readonly userID: string; readonly isFollowing: boolean } & {
		readonly __typename: "User";
	};
} & { readonly __typename: "Mutation" };

export type GetUserFollowingQueryVariables = Exact<{
	userID: Scalars["UUID"];
}>;

export type GetUserFollowingQuery = {
	readonly getUserByID: { readonly userID: string; readonly isFollowing: boolean } & {
		readonly __typename: "User";
	};
} & { readonly __typename: "Query" };

export type UnFollowUserMutationVariables = Exact<{
	userID: Scalars["UUID"];
}>;

export type UnFollowUserMutation = {
	readonly unFollowUser: { readonly userID: string; readonly isFollowing: boolean } & {
		readonly __typename: "User";
	};
} & { readonly __typename: "Mutation" };

export type UpdatePlaylistPrivacyMutationVariables = Exact<{
	input: UpdatePlaylistPrivacyInput;
}>;

export type UpdatePlaylistPrivacyMutation = {
	readonly updatePlaylistPrivacy: {
		readonly playlistID: string;
		readonly privacy: PlaylistPrivacy;
	} & { readonly __typename: "Playlist" };
} & { readonly __typename: "Mutation" };

export type UpdatePlaylistTitleMutationVariables = Exact<{
	input: UpdatePlaylistTitleInput;
}>;

export type UpdatePlaylistTitleMutation = {
	readonly updatePlaylistTitle: { readonly playlistID: string; readonly title: number } & {
		readonly __typename: "Playlist";
	};
} & { readonly __typename: "Mutation" };

export type GetNowPlayingQueryVariables = Exact<{ [key: string]: never }>;

export type GetNowPlayingQuery = {
	readonly getQueue: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Query" };

export type GetAlbumPageQueryVariables = Exact<{
	albumID: Scalars["UUID"];
}>;

export type GetAlbumPageQuery = {
	readonly getAlbumByID: {
		readonly albumID: string;
		readonly title: number;
		readonly released: number;
		readonly duration: number;
		readonly playsTotal: number | null;
		readonly songsTotal: number;
		readonly artists: ReadonlyArray<
			{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
		>;
		readonly remixers: ReadonlyArray<
			{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
		>;
		readonly genres: ReadonlyArray<
			{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
		>;
		readonly songs: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly playsTotal: number | null;
				readonly discNumber: number;
				readonly trackNumber: number;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		>;
	} & { readonly __typename: "Album" };
} & { readonly __typename: "Query" };

export type GetArtistPageAlbumsQueryVariables = Exact<{
	artistID: Scalars["UUID"];
	orderBy: AlbumsOrderByInput;
}>;

export type GetArtistPageAlbumsQuery = {
	readonly getArtistByID: {
		readonly artistID: string;
		readonly albums: ReadonlyArray<
			{
				readonly albumID: string;
				readonly title: number;
				readonly released: number;
				readonly playsTotal: number | null;
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Album" }
		>;
	} & { readonly __typename: "Artist" };
} & { readonly __typename: "Query" };

export type GetArtistPageHomeQueryVariables = Exact<{
	artistID: Scalars["UUID"];
}>;

export type GetArtistPageHomeQuery = {
	readonly getArtistByID: {
		readonly artistID: string;
		readonly topTenSongs: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly playsTotal: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		>;
	} & { readonly __typename: "Artist" };
} & { readonly __typename: "Query" };

export type GetArtistPageSongsQueryVariables = Exact<{
	artistID: Scalars["UUID"];
	songsOrderBy: SongsOrderByInput;
}>;

export type GetArtistPageSongsQuery = {
	readonly getArtistByID: {
		readonly artistID: string;
		readonly songs: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly playsTotal: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		>;
	} & { readonly __typename: "Artist" };
} & { readonly __typename: "Query" };

export type GetArtistPageQueryVariables = Exact<{
	artistID: Scalars["UUID"];
}>;

export type GetArtistPageQuery = {
	readonly getArtistByID: {
		readonly name: number;
		readonly artistID: string;
		readonly songsTotal: number;
		readonly albumsTotal: number;
		readonly city: number | null;
		readonly since: number;
		readonly country: number | null;
		readonly playsTotal: number | null;
	} & { readonly __typename: "Artist" };
} & { readonly __typename: "Query" };

export type GetGenrePageQueryVariables = Exact<{
	genreID: Scalars["UUID"];
	songsOrderBy: SongsOrderByInput;
}>;

export type GetGenrePageQuery = {
	readonly getGenreByID: {
		readonly genreID: string;
		readonly name: number;
		readonly songs: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly playsTotal: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		>;
	} & { readonly __typename: "Genre" };
} & { readonly __typename: "Query" };

export type GetHomePageQueryVariables = Exact<{ [key: string]: never }>;

export type GetHomePageQuery = {
	readonly getTopTenSongs: ReadonlyArray<
		{
			readonly songID: string;
			readonly mix: string;
			readonly title: number;
			readonly duration: number;
			readonly playsTotal: number | null;
			readonly album: { readonly albumID: string; readonly title: number } & {
				readonly __typename: "Album";
			};
			readonly artists: ReadonlyArray<
				{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
			>;
			readonly genres: ReadonlyArray<
				{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
			>;
			readonly featuring: ReadonlyArray<
				{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
			>;
			readonly remixers: ReadonlyArray<
				{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
			>;
		} & { readonly __typename: "Song" }
	>;
	readonly getTrendingAlbums: ReadonlyArray<
		{
			readonly albumID: string;
			readonly title: number;
			readonly released: number;
			readonly playsTotal: number | null;
			readonly artists: ReadonlyArray<
				{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
			>;
			readonly remixers: ReadonlyArray<
				{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
			>;
		} & { readonly __typename: "Album" }
	>;
	readonly getTrendingPlaylists: ReadonlyArray<
		{
			readonly playlistID: string;
			readonly title: number;
			readonly songsTotal: number | null;
			readonly playsTotal: number | null;
			readonly user: { readonly userID: string; readonly name: number } & {
				readonly __typename: "User";
			};
		} & { readonly __typename: "Playlist" }
	>;
} & { readonly __typename: "Query" };

export type GetLibraryAlbumAtIndexQueryVariables = Exact<{
	input: LibraryAlbumAtIndexInput;
}>;

export type GetLibraryAlbumAtIndexQuery = {
	readonly getLibrary: {
		readonly albumAtIndex:
			| ({
					readonly albumID: string;
					readonly title: number;
					readonly released: number;
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Album" })
			| null;
	} & { readonly __typename: "Library" };
} & { readonly __typename: "Query" };

export type GetLibraryAlbumsTotalQueryVariables = Exact<{ [key: string]: never }>;

export type GetLibraryAlbumsTotalQuery = {
	readonly getLibrary: { readonly albumsTotal: number | null } & { readonly __typename: "Library" };
} & { readonly __typename: "Query" };

export type GetLibraryArtistAtIndexQueryVariables = Exact<{
	input: LibraryArtistAtIndexInput;
}>;

export type GetLibraryArtistAtIndexQuery = {
	readonly getLibrary: {
		readonly artistAtIndex:
			| ({
					readonly name: number;
					readonly artistID: string;
					readonly songsTotal: number;
					readonly albumsTotal: number;
			  } & { readonly __typename: "Artist" })
			| null;
	} & { readonly __typename: "Library" };
} & { readonly __typename: "Query" };

export type GetLibraryArtistsTotalQueryVariables = Exact<{ [key: string]: never }>;

export type GetLibraryArtistsTotalQuery = {
	readonly getLibrary: { readonly artistsTotal: number | null } & {
		readonly __typename: "Library";
	};
} & { readonly __typename: "Query" };

export type GetLibraryGenreAtIndexQueryVariables = Exact<{
	input: LibraryGenreAtIndexInput;
}>;

export type GetLibraryGenreAtIndexQuery = {
	readonly getLibrary: {
		readonly genreAtIndex:
			| ({ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" })
			| null;
	} & { readonly __typename: "Library" };
} & { readonly __typename: "Query" };

export type GetLibraryGenresTotalQueryVariables = Exact<{ [key: string]: never }>;

export type GetLibraryGenresTotalQuery = {
	readonly getLibrary: { readonly genresTotal: number | null } & { readonly __typename: "Library" };
} & { readonly __typename: "Query" };

export type GetLibraryPlaylistAtIndexQueryVariables = Exact<{
	input: LibraryPlaylistAtIndexInput;
}>;

export type GetLibraryPlaylistAtIndexQuery = {
	readonly getLibrary: {
		readonly playlistAtIndex:
			| ({
					readonly playlistID: string;
					readonly title: number;
					readonly songsTotal: number | null;
					readonly dateAddedToLibrary: number | null;
					readonly user: { readonly userID: string; readonly name: number } & {
						readonly __typename: "User";
					};
			  } & { readonly __typename: "Playlist" })
			| null;
	} & { readonly __typename: "Library" };
} & { readonly __typename: "Query" };

export type GetLibraryPlaylistsTotalQueryVariables = Exact<{ [key: string]: never }>;

export type GetLibraryPlaylistsTotalQuery = {
	readonly getLibrary: { readonly playlistsTotal: number | null } & {
		readonly __typename: "Library";
	};
} & { readonly __typename: "Query" };

export type AddCatalogToLibraryMutationVariables = Exact<{ [key: string]: never }>;

export type AddCatalogToLibraryMutation = { readonly addCatalogToLibrary: void | null } & {
	readonly __typename: "Mutation";
};

export type DeleteLibraryMutationVariables = Exact<{ [key: string]: never }>;

export type DeleteLibraryMutation = { readonly deleteLibrary: void | null } & {
	readonly __typename: "Mutation";
};

export type ShuffleLibraryMutationVariables = Exact<{ [key: string]: never }>;

export type ShuffleLibraryMutation = {
	readonly shuffleLibrary: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type GetLibrarySongAtIndexQueryVariables = Exact<{
	input: LibrarySongAtIndexInput;
}>;

export type GetLibrarySongAtIndexQuery = {
	readonly getLibrary: {
		readonly songAtIndex:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Library" };
} & { readonly __typename: "Query" };

export type GetLibrarySongsTotalQueryVariables = Exact<{ [key: string]: never }>;

export type GetLibrarySongsTotalQuery = {
	readonly getLibrary: { readonly songsTotal: number | null } & { readonly __typename: "Library" };
} & { readonly __typename: "Query" };

export type GetPlaylistPageQueryVariables = Exact<{
	playlistID: Scalars["UUID"];
}>;

export type GetPlaylistPageQuery = {
	readonly getPlaylistByID: {
		readonly playlistID: string;
		readonly title: number;
		readonly songsTotal: number | null;
		readonly privacy: PlaylistPrivacy;
		readonly duration: number | null;
		readonly dateCreated: number;
		readonly user: { readonly userID: string; readonly name: number } & {
			readonly __typename: "User";
		};
		readonly songs: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly playlistIndex: number | null;
				readonly dateAddedToPlaylist: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Playlist" };
} & { readonly __typename: "Query" };

export type RemoveSongFromPlaylistMutationVariables = Exact<{
	playlistID: Scalars["UUID"];
	index: Scalars["NonNegativeInt"];
}>;

export type RemoveSongFromPlaylistMutation = {
	readonly removeSongFromPlaylist: {
		readonly playlistID: string;
		readonly songsTotal: number | null;
		readonly songs: ReadonlyArray<
			{ readonly songID: string } & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Playlist" };
} & { readonly __typename: "Mutation" };

export type GetQueueLaterQueryVariables = Exact<{ [key: string]: never }>;

export type GetQueueLaterQuery = {
	readonly getQueue: {
		readonly later: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Query" };

export type GetQueueNextQueryVariables = Exact<{ [key: string]: never }>;

export type GetQueueNextQuery = {
	readonly getQueue: {
		readonly next: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Query" };

export type GetQueuePreviousQueryVariables = Exact<{ [key: string]: never }>;

export type GetQueuePreviousQuery = {
	readonly getQueue: {
		readonly previous: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Query" };

export type ClearNextQueuesMutationVariables = Exact<{ [key: string]: never }>;

export type ClearNextQueuesMutation = {
	readonly clearNextQueues: {
		readonly next: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
		readonly later: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type ClearQueuesMutationVariables = Exact<{ [key: string]: never }>;

export type ClearQueuesMutation = {
	readonly clearQueues: {
		readonly previous: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
		readonly next: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
		readonly later: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type ShuffleNextAndLaterMutationVariables = Exact<{ [key: string]: never }>;

export type ShuffleNextAndLaterMutation = {
	readonly shuffleNextAndLater: {
		readonly next: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
		readonly later: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type WriteQueueQueryVariables = Exact<{ [key: string]: never }>;

export type WriteQueueQuery = {
	readonly getQueue: {
		readonly previous: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
		readonly next: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
		readonly later: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Query" };

export type JumpToSongInQueueLaterMutationVariables = Exact<{
	index: Scalars["NonNegativeInt"];
}>;

export type JumpToSongInQueueLaterMutation = {
	readonly jumpToSongInQueueLater: {
		readonly previous: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
		readonly next: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
		readonly later: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type JumpToSongInQueueNextMutationVariables = Exact<{
	index: Scalars["NonNegativeInt"];
}>;

export type JumpToSongInQueueNextMutation = {
	readonly jumpToSongInQueueNext: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
		readonly next: ReadonlyArray<
			{
				readonly songID: string;
				readonly mix: string;
				readonly title: number;
				readonly duration: number;
				readonly queueIndex: number | null;
				readonly album: { readonly albumID: string; readonly title: number } & {
					readonly __typename: "Album";
				};
				readonly artists: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly genres: ReadonlyArray<
					{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
				>;
				readonly featuring: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
				readonly remixers: ReadonlyArray<
					{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
				>;
			} & { readonly __typename: "Song" }
		> | null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type GetSongPageQueryVariables = Exact<{
	songID: Scalars["UUID"];
}>;

export type GetSongPageQuery = {
	readonly getSongByID: {
		readonly songID: string;
		readonly mix: string;
		readonly title: number;
		readonly duration: number;
		readonly bpm: number;
		readonly userPlaysTotal: number | null;
		readonly album: { readonly albumID: string; readonly title: number } & {
			readonly __typename: "Album";
		};
		readonly artists: ReadonlyArray<
			{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
		>;
		readonly genres: ReadonlyArray<
			{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
		>;
		readonly featuring: ReadonlyArray<
			{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
		>;
		readonly remixers: ReadonlyArray<
			{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
		>;
		readonly key: {
			readonly flat: number;
			readonly keyID: string;
			readonly sharp: number;
			readonly camelot: number;
		} & { readonly __typename: "Key" };
	} & { readonly __typename: "Song" };
} & { readonly __typename: "Query" };

export type GetTopOneHundredSongsQueryVariables = Exact<{ [key: string]: never }>;

export type GetTopOneHundredSongsQuery = {
	readonly getPlaysTotal: number;
	readonly getTopOneHundredSongs: ReadonlyArray<
		{
			readonly songID: string;
			readonly mix: string;
			readonly title: number;
			readonly duration: number;
			readonly playsTotal: number | null;
			readonly album: { readonly albumID: string; readonly title: number } & {
				readonly __typename: "Album";
			};
			readonly artists: ReadonlyArray<
				{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
			>;
			readonly genres: ReadonlyArray<
				{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
			>;
			readonly featuring: ReadonlyArray<
				{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
			>;
			readonly remixers: ReadonlyArray<
				{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
			>;
		} & { readonly __typename: "Song" }
	>;
} & { readonly __typename: "Query" };

export type PlayTopOneHundredSongsMutationVariables = Exact<{ [key: string]: never }>;

export type PlayTopOneHundredSongsMutation = {
	readonly playTopOneHundredSongs: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type ShuffleTopOneHundredSongsMutationVariables = Exact<{ [key: string]: never }>;

export type ShuffleTopOneHundredSongsMutation = {
	readonly shuffleTopOneHundredSongs: {
		readonly nowPlaying:
			| ({
					readonly songID: string;
					readonly mix: string;
					readonly title: number;
					readonly duration: number;
					readonly queueIndex: number | null;
					readonly album: { readonly albumID: string; readonly title: number } & {
						readonly __typename: "Album";
					};
					readonly artists: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly genres: ReadonlyArray<
						{ readonly genreID: string; readonly name: number } & { readonly __typename: "Genre" }
					>;
					readonly featuring: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
					readonly remixers: ReadonlyArray<
						{ readonly artistID: string; readonly name: number } & { readonly __typename: "Artist" }
					>;
			  } & { readonly __typename: "Song" })
			| null;
	} & { readonly __typename: "Queue" };
} & { readonly __typename: "Mutation" };

export type GetUserFollowersQueryVariables = Exact<{
	userID: Scalars["UUID"];
}>;

export type GetUserFollowersQuery = {
	readonly getUserByID: {
		readonly userID: string;
		readonly followers: ReadonlyArray<
			{ readonly userID: string; readonly name: number } & { readonly __typename: "User" }
		> | null;
	} & { readonly __typename: "User" };
} & { readonly __typename: "Query" };

export type GetUserPageQueryVariables = Exact<{
	userID: Scalars["UUID"];
}>;

export type GetUserPageQuery = {
	readonly getUserByID: {
		readonly userID: string;
		readonly name: number;
		readonly isFollower: boolean;
		readonly dateJoined: number;
	} & { readonly __typename: "User" };
} & { readonly __typename: "Query" };
