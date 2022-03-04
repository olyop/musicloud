INSERT INTO songs_featurings (
	index,
	song_id,
	artist_id
) VALUES (
	{{ index }},
	'{{ songID }}',
	'{{ artistID }}'
);