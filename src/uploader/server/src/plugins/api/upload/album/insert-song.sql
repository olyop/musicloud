INSERT INTO songs (
	bpm,
	mix,
	title,
	key_id,
	album_id,
	duration,
	disc_number,
	track_number
) VALUES (
	{{ bpm }},
	{{ mix }},
	{{ title }},
	{{ keyID }},
	{{ albumID }},
	{{ duration }},
	{{ discNumber }},
	{{ trackNumber }}
) RETURNING
	song_id;