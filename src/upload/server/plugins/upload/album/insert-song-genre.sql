INSERT INTO songs_genres (
	index,
	song_id,
	genre_id
) VALUES (
	{{ index }},
	'{{ songID }}',
	'{{ genreID }}'
);