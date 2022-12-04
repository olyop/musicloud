CREATE OR REPLACE FUNCTION
	handle_artist_in_library
	(user_id_arg uuid, artist_id_arg uuid, in_library_arg boolean)
RETURNS
	void
LANGUAGE
	plpgsql
VOLATILE
AS $$ BEGIN
	IF (in_library_arg) THEN
		DELETE FROM
			library_artists
		WHERE
			user_id = user_id_arg AND
			artist_id = artist_id_arg;
	ELSE
		IF NOT EXISTS (SELECT 1 FROM library_artists WHERE user_id = user_id_arg AND artist_id = artist_id_arg) THEN
			INSERT INTO library_artists
				(user_id, artist_id)
			VALUES
				(user_id_arg, artist_id_arg);
		END IF;
	END IF;
END $$;
