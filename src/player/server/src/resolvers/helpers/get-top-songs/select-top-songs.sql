SELECT
	{{ columnNames }}
FROM
	get_top_song_ids({{ limit }}) as song_ids
JOIN
	songs
		ON song_ids.song_id = songs.song_id;