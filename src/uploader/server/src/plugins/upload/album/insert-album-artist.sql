INSERT INTO albums_artists (
	index,
	album_id,
	artist_id
) VALUES (
	{{ index }},
	'{{ albumID }}',
	'{{ artistID }}'
);