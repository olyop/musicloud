CREATE OR REPLACE FUNCTION
	get_artist_song_ids
	(artist_id_arg uuid)
RETURNS
	TABLE (song_id uuid)
LANGUAGE
	plpgsql
STABLE
AS $$ BEGIN
	RETURN QUERY
		SELECT
			songs_artists.song_id
		FROM
			songs_artists
		WHERE
			artist_id = artist_id_arg
		UNION
		SELECT
			songs_remixers.song_id
		FROM
			songs_remixers
		WHERE
			artist_id = artist_id_arg
		UNION
		SELECT
			songs_featurings.song_id
		FROM
			songs_featurings
		WHERE
			artist_id = artist_id_arg;
END $$;
