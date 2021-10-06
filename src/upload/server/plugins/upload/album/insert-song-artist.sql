INSERT INTO songs_artists (
	index,
	song_id,
	artist_id
) VALUES (
	{{ index }},
	'{{ songID }}',
	'{{ artistID }}'
);