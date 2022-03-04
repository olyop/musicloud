SELECT
	{{ columnNames }}
FROM
	(
		SELECT
			song_id
		FROM
			songs_artists
		WHERE
			artist_id = '{{ artistID }}'
		UNION
		SELECT
			song_id
		FROM
			songs_remixers
		WHERE
			artist_id = '{{ artistID }}'
		UNION
		SELECT
			song_id
		FROM
			songs_featurings
		WHERE
			artist_id = '{{ artistID }}'
	) AS artist_songs_ids
JOIN
	songs
		ON artist_songs_ids.song_id = songs.song_id
JOIN
	albums
		ON songs.album_id = albums.album_id
ORDER BY
	{{ orderByField }} {{ orderByDirection }},
	songs.album_id ASC,
	songs.disc_number ASC,
	songs.track_number ASC;