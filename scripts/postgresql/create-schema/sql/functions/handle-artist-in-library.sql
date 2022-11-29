CREATE OR REPLACE FUNCTION
	handle_song_in_library
	(user_id_arg uuid, song_id_arg uuid, in_library_arg boolean)
RETURNS void
LANGUAGE plpgsql
VOLATILE
AS $$ BEGIN
	IF (in_library_arg) THEN
		DELETE FROM
			library_songs
		WHERE
			user_id = user_id_arg AND
			song_id = song_id_arg;
	ELSE
		INSERT INTO library_songs
			(user_id, song_id)
		VALUES
			(user_id_arg, song_id_arg);
	END IF;
END $$;
