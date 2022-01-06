SELECT
	{{ columnNames }}
FROM
	playlists_songs
WHERE
	playlist_id = '{{ playlistID }}'
ORDER BY
	index ASC;