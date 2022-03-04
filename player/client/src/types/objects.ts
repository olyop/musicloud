/* eslint-disable @typescript-eslint/indent */
import {
	KeyBase,
	UserBase,
	PlayBase,
	SongBase,
	AlbumBase,
	GenreBase,
	ArtistBase,
	UserID,
	PlaylistBase,
} from "@oly_op/music-app-common/types"

export interface StoreObject<T = string> {
	__typename: T,
}

export interface Key
	extends
		KeyBase, StoreObject<"Key"> {}

export interface InLibraryBase {
	inLibrary: boolean,
}

export interface UserClientBase
	extends StoreObject<"User">, UserID {
		isFollower: boolean,
		isFollowing: boolean,
		followers: User[] | null,
	}

export interface UserPlaylists {
	playlists: Playlist[],
	playlistsFilteredBySong: Playlist[],
}

export interface User
	extends
	UserBase,
	UserPlaylists,
	UserClientBase {}

export interface Play
	extends PlayBase, StoreObject<"Play"> {
		user: User,
		song: Song,
	}

export interface LibraryObject<T = string>
	extends StoreObject<T> {
		userPlays: Play[] | null,
		playsTotal: number | null,
		userPlaysTotal: number | null,
	}

export interface Genre
	extends GenreBase, LibraryObject<"Genre"> {
		songs: Song[],
		songsTotal: number | null,
		albumsTotal: number | null,
	}

export interface Album
	extends AlbumBase, InLibraryBase, LibraryObject<"Album"> {
		songs: Song[],
		genres: Genre[],
		duration: number,
		released: string,
		artists: Artist[],
		songsTotal: number,
		remixers: Artist[],
	}

export interface InLibraryObject<T = string>
	extends InLibraryBase, LibraryObject<T> {
		dateAddedToLibrary: number | null,
	}

export interface ArtistSongs {
	songs: Song[],
}

export interface ArtistTopTenSongs {
	topTenSongs: Song[],
}

export interface Artist
	extends ArtistBase, ArtistSongs, ArtistTopTenSongs, InLibraryObject<"Artist"> {
		since: string,
		albums: Album[],
		songsTotal: number,
		albumsTotal: number,
		city: string | null,
		country: string | null,
	}

export interface Song
	extends SongBase, InLibraryObject<"Song"> {
		key: Key,
		size: number,
		album: Album,
		genres: Genre[],
		artists: Artist[],
		remixers: Artist[],
		featuring: Artist[],
		isInPlaylist: boolean,
		queueIndex: number | null,
		playlistIndex: number | null,
		dateAddedToPlaylist: number | null,
	}

export interface Playlist
	extends PlaylistBase, InLibraryObject<"Playlist"> {
		user: User,
		songs: Song[],
		songsTotal: number | null,
	}

export interface QueueNext {
	next: Song[],
}

export interface QueueLater {
	later: Song[],
}

export interface QueuePrevious {
	previous: Song[],
}

export interface QueueNextLater
	extends
		QueueNext,
		QueueLater {}

export interface QueuePreviousNextLater
	extends
		QueuePrevious,
		QueueNextLater {}

export interface QueueNowPlaying {
	nowPlaying: Song | null,
}

export interface Queue
	extends
		QueuePreviousNextLater,
		QueueNowPlaying {}

export interface LibrarySongs {
	songs: Song[] | null,
}

export interface LibraryGenres {
	genres: Genre[] | null,
}

export interface LibraryAlbums {
	albums: Album[] | null,
}

export interface LibraryArtists {
	artists: Artist[] | null,
}

export interface LibraryPlaylists {
	playlists: Playlist[] | null,
}

export interface LibrarySongsTotal {
	songsTotal: number | null,
}

export interface LibraryGenresTotal {
	genresTotal: number | null,
}

export interface LibraryAlbumsTotal {
	albumsTotal: number | null,
}

export interface LibraryArtistsTotal {
	artistsTotal: number | null,
}

export interface LibraryPlaylistsTotal {
	playlistsTotal: number | null,
}

export interface LibrarySongsPaginated {
	songsPaginated: Song[] | null,
}

export interface LibraryGenresPaginated {
	genresPaginated: Genre[] | null,
}

export interface LibraryAlbumsPaginated {
	albumsPaginated: Album[] | null,
}

export interface LibraryArtistsPaginated {
	artistsPaginated: Artist[] | null,
}

export interface LibraryPlaylistsPaginated {
	playlistsPaginated: Playlist[] | null,
}

export interface Library
	extends
		LibrarySongs,
		LibraryGenres,
		LibraryAlbums,
		LibraryArtists,
		LibraryPlaylists,
		LibrarySongsTotal,
		LibraryGenresTotal,
		LibraryAlbumsTotal,
		LibraryArtistsTotal,
		LibraryPlaylistsTotal,
		LibrarySongsPaginated,
		LibraryGenresPaginated,
		LibraryAlbumsPaginated,
		LibraryArtistsPaginated,
		LibraryPlaylistsPaginated {}