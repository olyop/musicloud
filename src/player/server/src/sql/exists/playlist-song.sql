SELECT EXISTS (
	SELECT
		*
	FROM
		playlists_songs
	WHERE
		song_id = ${songID} AND
		playlist_id = ${playlistID
);