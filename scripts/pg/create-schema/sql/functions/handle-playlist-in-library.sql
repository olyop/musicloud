CREATE OR REPLACE FUNCTION
	handle_playlist_in_library
	(user_id_arg uuid, playlist_id_arg uuid, in_library_arg boolean)
RETURNS
	void
LANGUAGE
	plpgsql
VOLATILE
AS $$ BEGIN
	IF (in_library_arg) THEN
		DELETE FROM
			library_playlists
		WHERE
			user_id = user_id_arg AND
			playlist_id = playlist_id_arg;
	ELSE
		IF NOT EXISTS (SELECT 1 FROM library_playlists WHERE user_id = user_id_arg AND playlist_id = playlist_id_arg) THEN
			INSERT INTO library_playlists
				(user_id, playlist_id)
			VALUES
				(user_id_arg, playlist_id_arg);
		END IF;
	END IF;
END $$;
