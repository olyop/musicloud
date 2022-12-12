CREATE OR REPLACE FUNCTION
	delete_library
	(user_id_arg uuid)
RETURNS
	void
LANGUAGE
	plpgsql
VOLATILE
AS $$ BEGIN
	DELETE FROM
		library_songs
	WHERE
		user_id = user_id_arg;

	DELETE FROM
		library_artists
	WHERE
		user_id = user_id_arg;

	DELETE FROM
		library_playlists
	WHERE
		user_id = user_id_arg;
END $$;