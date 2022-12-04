CREATE OR REPLACE FUNCTION
	song_is_in_library
	(user_id_arg uuid, song_id_arg uuid)
RETURNS
	boolean
LANGUAGE
	plpgsql
STABLE
AS $$
	DECLARE
		in_library boolean;
	BEGIN
		SELECT EXISTS INTO in_library (
			SELECT
				*
			FROM
				library_songs
			WHERE
				user_id = user_id_arg AND
				song_id = song_id_arg
		);

		RETURN in_library;
	END
$$;
