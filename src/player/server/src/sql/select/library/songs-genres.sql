SELECT
	{{ columnNames }}
FROM
	library_songs
JOIN
	songs
		ON library_songs.song_id = songs.song_id
JOIN
	songs_genres
		ON library_songs.song_id = songs_genres.song_id
WHERE
	library_songs.user_id = '{{ userID }}' AND
	songs_genres.song_id = library_songs.song_id
	{{  }};