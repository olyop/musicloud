INSERT INTO songs (
	bpm,
	mix,
	title,
	key_id,
	song_id,
	album_id,
	duration,
	disc_number,
	track_number
) VALUES (
	{{ bpm }},
	{{ mix }},
	{{ title }},
	'{{ keyID }}',
	'{{ songID }}',
	'{{ albumID }}',
	{{ duration }},
	{{ discNumber }},
	{{ trackNumber }}
);