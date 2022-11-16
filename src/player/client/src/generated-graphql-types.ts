/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable import/newline-after-import */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-invalid-void-type */

import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
	released: Scalars["Date"];
	remixers: Array<Artist>;
	songs: Array<Song>;
	songsTotal: Scalars["PositiveInt"];
	title: Scalars["NonEmptyString"];
	userPlays?: Maybe<Array<Play>>;
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
	since: Scalars["Date"];
	songs: Array<Song>;
	songsTotal: Scalars["PositiveInt"];
	topTenSongs: Array<Song>;
	userPlays: Array<Play>;
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
	userPlays?: Maybe<Array<Play>>;
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
	changePassword?: Maybe<Scalars["Void"]>;
	clearNextQueues: Queue;
	clearQueues: Queue;
	createPlaylist: Playlist;
	deleteLibrary?: Maybe<Scalars["Void"]>;
	deletePlaylistByID?: Maybe<Scalars["Void"]>;
	deleteUser?: Maybe<Scalars["Void"]>;
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
	shuffleNext: Queue;
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

export type MutationChangePasswordArgs = {
	password: Scalars["NonEmptyString"];
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
	userPlays?: Maybe<Array<Play>>;
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
	getSearchResults: Array<Search>;
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

export type QueryGetSearchResultsArgs = {
	input: GetSearchResultsInput;
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

export type Search = Album | Artist | Genre | Playlist | Song | User;

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
	userPlays?: Maybe<Array<Play>>;
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
	plays?: Maybe<Array<Play>>;
	playsTotal?: Maybe<Scalars["PositiveInt"]>;
	userID: Scalars["UUID"];
};

export type UserPlaylistsFilteredBySongArgs = {
	songID: Scalars["UUID"];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
	resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
	| ResolverFn<TResult, TParent, TContext, TArgs>
	| ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
	TResult,
	TKey extends string,
	TParent,
	TContext,
	TArgs,
> {
	subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
	resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
	subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
	resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
	| SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
	| SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
	TResult,
	TKey extends string,
	TParent = {},
	TContext = {},
	TArgs = {},
> =
	| ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
	| SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
	parent: TParent,
	context: TContext,
	info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
	obj: T,
	context: TContext,
	info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
	next: NextResolverFn<TResult>,
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
	Album: ResolverTypeWrapper<Album>;
	AlbumsOrderByField: AlbumsOrderByField;
	AlbumsOrderByInput: AlbumsOrderByInput;
	Artist: ResolverTypeWrapper<Artist>;
	Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
	CreatePlaylistInput: CreatePlaylistInput;
	Date: ResolverTypeWrapper<Scalars["Date"]>;
	EmailAddress: ResolverTypeWrapper<Scalars["EmailAddress"]>;
	Genre: ResolverTypeWrapper<Genre>;
	GenresOrderByField: GenresOrderByField;
	GenresOrderByInput: GenresOrderByInput;
	GetSearchResultsInput: GetSearchResultsInput;
	Key: ResolverTypeWrapper<Key>;
	Library: ResolverTypeWrapper<Library>;
	LibraryAlbumAtIndexInput: LibraryAlbumAtIndexInput;
	LibraryArtistAtIndexInput: LibraryArtistAtIndexInput;
	LibraryArtistsOrderByField: LibraryArtistsOrderByField;
	LibraryArtistsOrderByInput: LibraryArtistsOrderByInput;
	LibraryGenreAtIndexInput: LibraryGenreAtIndexInput;
	LibraryPlaylistAtIndexInput: LibraryPlaylistAtIndexInput;
	LibraryPlaylistsOrderByField: LibraryPlaylistsOrderByField;
	LibraryPlaylistsOrderByInput: LibraryPlaylistsOrderByInput;
	LibrarySongAtIndexInput: LibrarySongAtIndexInput;
	LibrarySongsOrderByField: LibrarySongsOrderByField;
	LibrarySongsOrderByInput: LibrarySongsOrderByInput;
	Mutation: ResolverTypeWrapper<{}>;
	NonEmptyString: ResolverTypeWrapper<Scalars["NonEmptyString"]>;
	NonNegativeInt: ResolverTypeWrapper<Scalars["NonNegativeInt"]>;
	OrderByDirection: OrderByDirection;
	Play: ResolverTypeWrapper<Play>;
	Playlist: ResolverTypeWrapper<Playlist>;
	PlaylistPrivacy: PlaylistPrivacy;
	PositiveInt: ResolverTypeWrapper<Scalars["PositiveInt"]>;
	Query: ResolverTypeWrapper<{}>;
	Queue: ResolverTypeWrapper<Queue>;
	Search:
		| ResolversTypes["Album"]
		| ResolversTypes["Artist"]
		| ResolversTypes["Genre"]
		| ResolversTypes["Playlist"]
		| ResolversTypes["Song"]
		| ResolversTypes["User"];
	ShuffleLibraryCustomInput: ShuffleLibraryCustomInput;
	Song: ResolverTypeWrapper<Song>;
	SongsOrderByField: SongsOrderByField;
	SongsOrderByInput: SongsOrderByInput;
	String: ResolverTypeWrapper<Scalars["String"]>;
	TimeStamp: ResolverTypeWrapper<Scalars["TimeStamp"]>;
	UUID: ResolverTypeWrapper<Scalars["UUID"]>;
	UpdatePlaylistPrivacyInput: UpdatePlaylistPrivacyInput;
	UpdatePlaylistTitleInput: UpdatePlaylistTitleInput;
	User: ResolverTypeWrapper<User>;
	Void: ResolverTypeWrapper<Scalars["Void"]>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
	Album: Album;
	AlbumsOrderByInput: AlbumsOrderByInput;
	Artist: Artist;
	Boolean: Scalars["Boolean"];
	CreatePlaylistInput: CreatePlaylistInput;
	Date: Scalars["Date"];
	EmailAddress: Scalars["EmailAddress"];
	Genre: Genre;
	GenresOrderByInput: GenresOrderByInput;
	GetSearchResultsInput: GetSearchResultsInput;
	Key: Key;
	Library: Library;
	LibraryAlbumAtIndexInput: LibraryAlbumAtIndexInput;
	LibraryArtistAtIndexInput: LibraryArtistAtIndexInput;
	LibraryArtistsOrderByInput: LibraryArtistsOrderByInput;
	LibraryGenreAtIndexInput: LibraryGenreAtIndexInput;
	LibraryPlaylistAtIndexInput: LibraryPlaylistAtIndexInput;
	LibraryPlaylistsOrderByInput: LibraryPlaylistsOrderByInput;
	LibrarySongAtIndexInput: LibrarySongAtIndexInput;
	LibrarySongsOrderByInput: LibrarySongsOrderByInput;
	Mutation: {};
	NonEmptyString: Scalars["NonEmptyString"];
	NonNegativeInt: Scalars["NonNegativeInt"];
	Play: Play;
	Playlist: Playlist;
	PositiveInt: Scalars["PositiveInt"];
	Query: {};
	Queue: Queue;
	Search:
		| ResolversParentTypes["Album"]
		| ResolversParentTypes["Artist"]
		| ResolversParentTypes["Genre"]
		| ResolversParentTypes["Playlist"]
		| ResolversParentTypes["Song"]
		| ResolversParentTypes["User"];
	ShuffleLibraryCustomInput: ShuffleLibraryCustomInput;
	Song: Song;
	SongsOrderByInput: SongsOrderByInput;
	String: Scalars["String"];
	TimeStamp: Scalars["TimeStamp"];
	UUID: Scalars["UUID"];
	UpdatePlaylistPrivacyInput: UpdatePlaylistPrivacyInput;
	UpdatePlaylistTitleInput: UpdatePlaylistTitleInput;
	User: User;
	Void: Scalars["Void"];
};

export type AlbumResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes["Album"] = ResolversParentTypes["Album"],
> = {
	albumID?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	artists?: Resolver<Array<ResolversTypes["Artist"]>, ParentType, ContextType>;
	duration?: Resolver<ResolversTypes["PositiveInt"], ParentType, ContextType>;
	genres?: Resolver<Array<ResolversTypes["Genre"]>, ParentType, ContextType>;
	inLibrary?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
	playsTotal?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	released?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
	remixers?: Resolver<Array<ResolversTypes["Artist"]>, ParentType, ContextType>;
	songs?: Resolver<Array<ResolversTypes["Song"]>, ParentType, ContextType>;
	songsTotal?: Resolver<ResolversTypes["PositiveInt"], ParentType, ContextType>;
	title?: Resolver<ResolversTypes["NonEmptyString"], ParentType, ContextType>;
	userPlays?: Resolver<Maybe<Array<ResolversTypes["Play"]>>, ParentType, ContextType>;
	userPlaysTotal?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArtistResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes["Artist"] = ResolversParentTypes["Artist"],
> = {
	albums?: Resolver<
		Array<ResolversTypes["Album"]>,
		ParentType,
		ContextType,
		RequireFields<ArtistAlbumsArgs, "orderBy">
	>;
	albumsTotal?: Resolver<ResolversTypes["PositiveInt"], ParentType, ContextType>;
	artistID?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	city?: Resolver<Maybe<ResolversTypes["NonEmptyString"]>, ParentType, ContextType>;
	country?: Resolver<Maybe<ResolversTypes["NonEmptyString"]>, ParentType, ContextType>;
	dateAddedToLibrary?: Resolver<Maybe<ResolversTypes["TimeStamp"]>, ParentType, ContextType>;
	inLibrary?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
	name?: Resolver<ResolversTypes["NonEmptyString"], ParentType, ContextType>;
	playsTotal?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	since?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
	songs?: Resolver<
		Array<ResolversTypes["Song"]>,
		ParentType,
		ContextType,
		RequireFields<ArtistSongsArgs, "orderBy">
	>;
	songsTotal?: Resolver<ResolversTypes["PositiveInt"], ParentType, ContextType>;
	topTenSongs?: Resolver<Array<ResolversTypes["Song"]>, ParentType, ContextType>;
	userPlays?: Resolver<Array<ResolversTypes["Play"]>, ParentType, ContextType>;
	userPlaysTotal?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
	name: "Date";
}

export interface EmailAddressScalarConfig
	extends GraphQLScalarTypeConfig<ResolversTypes["EmailAddress"], any> {
	name: "EmailAddress";
}

export type GenreResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes["Genre"] = ResolversParentTypes["Genre"],
> = {
	genreID?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	name?: Resolver<ResolversTypes["NonEmptyString"], ParentType, ContextType>;
	playsTotal?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	songs?: Resolver<
		Array<ResolversTypes["Song"]>,
		ParentType,
		ContextType,
		RequireFields<GenreSongsArgs, "orderBy">
	>;
	songsTotal?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	userPlays?: Resolver<Maybe<Array<ResolversTypes["Play"]>>, ParentType, ContextType>;
	userPlaysTotal?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type KeyResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes["Key"] = ResolversParentTypes["Key"],
> = {
	camelot?: Resolver<ResolversTypes["NonEmptyString"], ParentType, ContextType>;
	flat?: Resolver<ResolversTypes["NonEmptyString"], ParentType, ContextType>;
	keyID?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	sharp?: Resolver<ResolversTypes["NonEmptyString"], ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LibraryResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes["Library"] = ResolversParentTypes["Library"],
> = {
	albumAtIndex?: Resolver<
		Maybe<ResolversTypes["Album"]>,
		ParentType,
		ContextType,
		RequireFields<LibraryAlbumAtIndexArgs, "input">
	>;
	albumsTotal?: Resolver<Maybe<ResolversTypes["NonNegativeInt"]>, ParentType, ContextType>;
	artistAtIndex?: Resolver<
		Maybe<ResolversTypes["Artist"]>,
		ParentType,
		ContextType,
		RequireFields<LibraryArtistAtIndexArgs, "input">
	>;
	artistsTotal?: Resolver<Maybe<ResolversTypes["NonNegativeInt"]>, ParentType, ContextType>;
	duration?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	genreAtIndex?: Resolver<
		Maybe<ResolversTypes["Genre"]>,
		ParentType,
		ContextType,
		RequireFields<LibraryGenreAtIndexArgs, "input">
	>;
	genresTotal?: Resolver<Maybe<ResolversTypes["NonNegativeInt"]>, ParentType, ContextType>;
	playlistAtIndex?: Resolver<
		Maybe<ResolversTypes["Playlist"]>,
		ParentType,
		ContextType,
		RequireFields<LibraryPlaylistAtIndexArgs, "input">
	>;
	playlistsTotal?: Resolver<Maybe<ResolversTypes["NonNegativeInt"]>, ParentType, ContextType>;
	songAtIndex?: Resolver<
		Maybe<ResolversTypes["Song"]>,
		ParentType,
		ContextType,
		RequireFields<LibrarySongAtIndexArgs, "input">
	>;
	songsTotal?: Resolver<Maybe<ResolversTypes["NonNegativeInt"]>, ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"],
> = {
	addAlbumToLibrary?: Resolver<
		ResolversTypes["Album"],
		ParentType,
		ContextType,
		RequireFields<MutationAddAlbumToLibraryArgs, "albumID">
	>;
	addAlbumToPlaylist?: Resolver<
		ResolversTypes["Playlist"],
		ParentType,
		ContextType,
		RequireFields<MutationAddAlbumToPlaylistArgs, "albumID" | "playlistID">
	>;
	addArtistToLibrary?: Resolver<
		ResolversTypes["Artist"],
		ParentType,
		ContextType,
		RequireFields<MutationAddArtistToLibraryArgs, "artistID">
	>;
	addCatalogToLibrary?: Resolver<Maybe<ResolversTypes["Void"]>, ParentType, ContextType>;
	addPlaylistToLibrary?: Resolver<
		ResolversTypes["Playlist"],
		ParentType,
		ContextType,
		RequireFields<MutationAddPlaylistToLibraryArgs, "playlistID">
	>;
	addSongToLibrary?: Resolver<
		ResolversTypes["Song"],
		ParentType,
		ContextType,
		RequireFields<MutationAddSongToLibraryArgs, "songID">
	>;
	addSongToPlaylist?: Resolver<
		ResolversTypes["Playlist"],
		ParentType,
		ContextType,
		RequireFields<MutationAddSongToPlaylistArgs, "playlistID" | "songID">
	>;
	changePassword?: Resolver<
		Maybe<ResolversTypes["Void"]>,
		ParentType,
		ContextType,
		RequireFields<MutationChangePasswordArgs, "password">
	>;
	clearNextQueues?: Resolver<ResolversTypes["Queue"], ParentType, ContextType>;
	clearQueues?: Resolver<ResolversTypes["Queue"], ParentType, ContextType>;
	createPlaylist?: Resolver<
		ResolversTypes["Playlist"],
		ParentType,
		ContextType,
		RequireFields<MutationCreatePlaylistArgs, "input">
	>;
	deleteLibrary?: Resolver<Maybe<ResolversTypes["Void"]>, ParentType, ContextType>;
	deletePlaylistByID?: Resolver<
		Maybe<ResolversTypes["Void"]>,
		ParentType,
		ContextType,
		RequireFields<MutationDeletePlaylistByIdArgs, "playlistID">
	>;
	deleteUser?: Resolver<Maybe<ResolversTypes["Void"]>, ParentType, ContextType>;
	followUser?: Resolver<
		ResolversTypes["User"],
		ParentType,
		ContextType,
		RequireFields<MutationFollowUserArgs, "userID">
	>;
	jumpToSongInQueueLater?: Resolver<
		ResolversTypes["Queue"],
		ParentType,
		ContextType,
		RequireFields<MutationJumpToSongInQueueLaterArgs, "index">
	>;
	jumpToSongInQueueNext?: Resolver<
		ResolversTypes["Queue"],
		ParentType,
		ContextType,
		RequireFields<MutationJumpToSongInQueueNextArgs, "index">
	>;
	nextQueueSong?: Resolver<ResolversTypes["Queue"], ParentType, ContextType>;
	playAlbum?: Resolver<
		ResolversTypes["Queue"],
		ParentType,
		ContextType,
		RequireFields<MutationPlayAlbumArgs, "albumID">
	>;
	playLibrary?: Resolver<ResolversTypes["Queue"], ParentType, ContextType>;
	playPlaylist?: Resolver<
		ResolversTypes["Queue"],
		ParentType,
		ContextType,
		RequireFields<MutationPlayPlaylistArgs, "playlistID">
	>;
	playSong?: Resolver<
		ResolversTypes["Queue"],
		ParentType,
		ContextType,
		RequireFields<MutationPlaySongArgs, "songID">
	>;
	playTopOneHundredSongs?: Resolver<ResolversTypes["Queue"], ParentType, ContextType>;
	previousQueueSong?: Resolver<ResolversTypes["Queue"], ParentType, ContextType>;
	queueSongAfter?: Resolver<
		ResolversTypes["Queue"],
		ParentType,
		ContextType,
		RequireFields<MutationQueueSongAfterArgs, "songID">
	>;
	queueSongLater?: Resolver<
		ResolversTypes["Queue"],
		ParentType,
		ContextType,
		RequireFields<MutationQueueSongLaterArgs, "songID">
	>;
	queueSongNext?: Resolver<
		ResolversTypes["Queue"],
		ParentType,
		ContextType,
		RequireFields<MutationQueueSongNextArgs, "songID">
	>;
	removeAlbumFromLibrary?: Resolver<
		ResolversTypes["Album"],
		ParentType,
		ContextType,
		RequireFields<MutationRemoveAlbumFromLibraryArgs, "albumID">
	>;
	removeArtistFromLibrary?: Resolver<
		ResolversTypes["Artist"],
		ParentType,
		ContextType,
		RequireFields<MutationRemoveArtistFromLibraryArgs, "artistID">
	>;
	removePlaylistFromLibrary?: Resolver<
		ResolversTypes["Playlist"],
		ParentType,
		ContextType,
		RequireFields<MutationRemovePlaylistFromLibraryArgs, "playlistID">
	>;
	removeSongFromLibrary?: Resolver<
		ResolversTypes["Song"],
		ParentType,
		ContextType,
		RequireFields<MutationRemoveSongFromLibraryArgs, "songID">
	>;
	removeSongFromPlaylist?: Resolver<
		ResolversTypes["Playlist"],
		ParentType,
		ContextType,
		RequireFields<MutationRemoveSongFromPlaylistArgs, "index" | "playlistID">
	>;
	removeSongFromQueueLater?: Resolver<
		ResolversTypes["Queue"],
		ParentType,
		ContextType,
		RequireFields<MutationRemoveSongFromQueueLaterArgs, "index">
	>;
	removeSongFromQueueNext?: Resolver<
		ResolversTypes["Queue"],
		ParentType,
		ContextType,
		RequireFields<MutationRemoveSongFromQueueNextArgs, "index">
	>;
	shuffleAlbum?: Resolver<
		ResolversTypes["Queue"],
		ParentType,
		ContextType,
		RequireFields<MutationShuffleAlbumArgs, "albumID">
	>;
	shuffleArtist?: Resolver<
		ResolversTypes["Queue"],
		ParentType,
		ContextType,
		RequireFields<MutationShuffleArtistArgs, "artistID">
	>;
	shuffleLibrary?: Resolver<ResolversTypes["Queue"], ParentType, ContextType>;
	shuffleLibraryCustom?: Resolver<
		ResolversTypes["Queue"],
		ParentType,
		ContextType,
		RequireFields<MutationShuffleLibraryCustomArgs, "input">
	>;
	shuffleNext?: Resolver<ResolversTypes["Queue"], ParentType, ContextType>;
	shufflePlaylist?: Resolver<
		ResolversTypes["Queue"],
		ParentType,
		ContextType,
		RequireFields<MutationShufflePlaylistArgs, "playlistID">
	>;
	shuffleTopOneHundredSongs?: Resolver<ResolversTypes["Queue"], ParentType, ContextType>;
	test?: Resolver<Maybe<ResolversTypes["Void"]>, ParentType, ContextType>;
	unFollowUser?: Resolver<
		ResolversTypes["User"],
		ParentType,
		ContextType,
		RequireFields<MutationUnFollowUserArgs, "userID">
	>;
	updatePlaylistPrivacy?: Resolver<
		ResolversTypes["Playlist"],
		ParentType,
		ContextType,
		RequireFields<MutationUpdatePlaylistPrivacyArgs, "input">
	>;
	updatePlaylistTitle?: Resolver<
		ResolversTypes["Playlist"],
		ParentType,
		ContextType,
		RequireFields<MutationUpdatePlaylistTitleArgs, "input">
	>;
};

export interface NonEmptyStringScalarConfig
	extends GraphQLScalarTypeConfig<ResolversTypes["NonEmptyString"], any> {
	name: "NonEmptyString";
}

export interface NonNegativeIntScalarConfig
	extends GraphQLScalarTypeConfig<ResolversTypes["NonNegativeInt"], any> {
	name: "NonNegativeInt";
}

export type PlayResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes["Play"] = ResolversParentTypes["Play"],
> = {
	dateCreated?: Resolver<ResolversTypes["TimeStamp"], ParentType, ContextType>;
	playID?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	song?: Resolver<ResolversTypes["Song"], ParentType, ContextType>;
	user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlaylistResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes["Playlist"] = ResolversParentTypes["Playlist"],
> = {
	dateAddedToLibrary?: Resolver<Maybe<ResolversTypes["TimeStamp"]>, ParentType, ContextType>;
	dateCreated?: Resolver<ResolversTypes["TimeStamp"], ParentType, ContextType>;
	duration?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	inLibrary?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
	playlistID?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	playsTotal?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	privacy?: Resolver<ResolversTypes["PlaylistPrivacy"], ParentType, ContextType>;
	songs?: Resolver<Maybe<Array<ResolversTypes["Song"]>>, ParentType, ContextType>;
	songsTotal?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	title?: Resolver<ResolversTypes["NonEmptyString"], ParentType, ContextType>;
	user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
	userPlays?: Resolver<Maybe<Array<ResolversTypes["Play"]>>, ParentType, ContextType>;
	userPlaysTotal?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface PositiveIntScalarConfig
	extends GraphQLScalarTypeConfig<ResolversTypes["PositiveInt"], any> {
	name: "PositiveInt";
}

export type QueryResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = {
	getAlbumByID?: Resolver<
		ResolversTypes["Album"],
		ParentType,
		ContextType,
		RequireFields<QueryGetAlbumByIdArgs, "albumID">
	>;
	getArtistByID?: Resolver<
		ResolversTypes["Artist"],
		ParentType,
		ContextType,
		RequireFields<QueryGetArtistByIdArgs, "artistID">
	>;
	getGenreByID?: Resolver<
		ResolversTypes["Genre"],
		ParentType,
		ContextType,
		RequireFields<QueryGetGenreByIdArgs, "genreID">
	>;
	getLibrary?: Resolver<ResolversTypes["Library"], ParentType, ContextType>;
	getPlayByID?: Resolver<
		ResolversTypes["Play"],
		ParentType,
		ContextType,
		RequireFields<QueryGetPlayByIdArgs, "playID">
	>;
	getPlaylistByID?: Resolver<
		ResolversTypes["Playlist"],
		ParentType,
		ContextType,
		RequireFields<QueryGetPlaylistByIdArgs, "playlistID">
	>;
	getPlaysTotal?: Resolver<ResolversTypes["NonNegativeInt"], ParentType, ContextType>;
	getQueue?: Resolver<ResolversTypes["Queue"], ParentType, ContextType>;
	getSearchResults?: Resolver<
		Array<ResolversTypes["Search"]>,
		ParentType,
		ContextType,
		RequireFields<QueryGetSearchResultsArgs, "input">
	>;
	getSongByID?: Resolver<
		ResolversTypes["Song"],
		ParentType,
		ContextType,
		RequireFields<QueryGetSongByIdArgs, "songID">
	>;
	getTopOneHundredSongs?: Resolver<Array<ResolversTypes["Song"]>, ParentType, ContextType>;
	getTopTenSongs?: Resolver<Array<ResolversTypes["Song"]>, ParentType, ContextType>;
	getTrendingAlbums?: Resolver<Array<ResolversTypes["Album"]>, ParentType, ContextType>;
	getTrendingArtists?: Resolver<Array<ResolversTypes["Artist"]>, ParentType, ContextType>;
	getTrendingPlaylists?: Resolver<Array<ResolversTypes["Playlist"]>, ParentType, ContextType>;
	getTrendingSongs?: Resolver<Array<ResolversTypes["Song"]>, ParentType, ContextType>;
	getUser?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
	getUserByID?: Resolver<
		ResolversTypes["User"],
		ParentType,
		ContextType,
		RequireFields<QueryGetUserByIdArgs, "userID">
	>;
};

export type QueueResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes["Queue"] = ResolversParentTypes["Queue"],
> = {
	later?: Resolver<Maybe<Array<ResolversTypes["Song"]>>, ParentType, ContextType>;
	next?: Resolver<Maybe<Array<ResolversTypes["Song"]>>, ParentType, ContextType>;
	nowPlaying?: Resolver<Maybe<ResolversTypes["Song"]>, ParentType, ContextType>;
	previous?: Resolver<Maybe<Array<ResolversTypes["Song"]>>, ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes["Search"] = ResolversParentTypes["Search"],
> = {
	__resolveType: TypeResolveFn<
		"Album" | "Artist" | "Genre" | "Playlist" | "Song" | "User",
		ParentType,
		ContextType
	>;
};

export type SongResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes["Song"] = ResolversParentTypes["Song"],
> = {
	album?: Resolver<ResolversTypes["Album"], ParentType, ContextType>;
	artists?: Resolver<Array<ResolversTypes["Artist"]>, ParentType, ContextType>;
	bpm?: Resolver<ResolversTypes["PositiveInt"], ParentType, ContextType>;
	dateAddedToLibrary?: Resolver<Maybe<ResolversTypes["TimeStamp"]>, ParentType, ContextType>;
	dateAddedToPlaylist?: Resolver<
		Maybe<ResolversTypes["TimeStamp"]>,
		ParentType,
		ContextType,
		RequireFields<SongDateAddedToPlaylistArgs, "playlistID">
	>;
	discNumber?: Resolver<ResolversTypes["PositiveInt"], ParentType, ContextType>;
	duration?: Resolver<ResolversTypes["PositiveInt"], ParentType, ContextType>;
	featuring?: Resolver<Array<ResolversTypes["Artist"]>, ParentType, ContextType>;
	genres?: Resolver<Array<ResolversTypes["Genre"]>, ParentType, ContextType>;
	inLibrary?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
	isInPlaylist?: Resolver<
		ResolversTypes["Boolean"],
		ParentType,
		ContextType,
		RequireFields<SongIsInPlaylistArgs, "playlistID">
	>;
	key?: Resolver<ResolversTypes["Key"], ParentType, ContextType>;
	mix?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	playlistIndex?: Resolver<
		Maybe<ResolversTypes["NonNegativeInt"]>,
		ParentType,
		ContextType,
		RequireFields<SongPlaylistIndexArgs, "playlistID">
	>;
	playsTotal?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	queueIndex?: Resolver<Maybe<ResolversTypes["NonNegativeInt"]>, ParentType, ContextType>;
	remixers?: Resolver<Array<ResolversTypes["Artist"]>, ParentType, ContextType>;
	size?: Resolver<ResolversTypes["PositiveInt"], ParentType, ContextType>;
	songID?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	title?: Resolver<ResolversTypes["NonEmptyString"], ParentType, ContextType>;
	trackNumber?: Resolver<ResolversTypes["PositiveInt"], ParentType, ContextType>;
	userPlays?: Resolver<Maybe<Array<ResolversTypes["Play"]>>, ParentType, ContextType>;
	userPlaysTotal?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface TimeStampScalarConfig
	extends GraphQLScalarTypeConfig<ResolversTypes["TimeStamp"], any> {
	name: "TimeStamp";
}

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["UUID"], any> {
	name: "UUID";
}

export type UserResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"],
> = {
	dateJoined?: Resolver<ResolversTypes["TimeStamp"], ParentType, ContextType>;
	emailAddress?: Resolver<ResolversTypes["EmailAddress"], ParentType, ContextType>;
	followers?: Resolver<Maybe<Array<ResolversTypes["User"]>>, ParentType, ContextType>;
	isFollower?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
	isFollowing?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
	name?: Resolver<ResolversTypes["NonEmptyString"], ParentType, ContextType>;
	playlists?: Resolver<Maybe<Array<ResolversTypes["Playlist"]>>, ParentType, ContextType>;
	playlistsFilteredBySong?: Resolver<
		Maybe<Array<ResolversTypes["Playlist"]>>,
		ParentType,
		ContextType,
		RequireFields<UserPlaylistsFilteredBySongArgs, "songID">
	>;
	playlistsTotal?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	plays?: Resolver<Maybe<Array<ResolversTypes["Play"]>>, ParentType, ContextType>;
	playsTotal?: Resolver<Maybe<ResolversTypes["PositiveInt"]>, ParentType, ContextType>;
	userID?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Void"], any> {
	name: "Void";
}

export type Resolvers<ContextType = any> = {
	Album?: AlbumResolvers<ContextType>;
	Artist?: ArtistResolvers<ContextType>;
	Date?: GraphQLScalarType;
	EmailAddress?: GraphQLScalarType;
	Genre?: GenreResolvers<ContextType>;
	Key?: KeyResolvers<ContextType>;
	Library?: LibraryResolvers<ContextType>;
	Mutation?: MutationResolvers<ContextType>;
	NonEmptyString?: GraphQLScalarType;
	NonNegativeInt?: GraphQLScalarType;
	Play?: PlayResolvers<ContextType>;
	Playlist?: PlaylistResolvers<ContextType>;
	PositiveInt?: GraphQLScalarType;
	Query?: QueryResolvers<ContextType>;
	Queue?: QueueResolvers<ContextType>;
	Search?: SearchResolvers<ContextType>;
	Song?: SongResolvers<ContextType>;
	TimeStamp?: GraphQLScalarType;
	UUID?: GraphQLScalarType;
	User?: UserResolvers<ContextType>;
	Void?: GraphQLScalarType;
};
