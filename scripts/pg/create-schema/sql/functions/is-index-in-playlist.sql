CREATE OR REPLACE FUNCTION
	is_index_in_playlist
	(index_arg integer, playlist_id_arg uuid)
RETURNS
	boolean
LANGUAGE
	plpgsql
	STABLE
AS $$
	DECLARE
		is_in_playlist boolean;
	BEGIN
		SELECT EXISTS INTO is_in_playlist (
			SELECT FROM
				playlists_songs
			WHERE
				index = index_arg AND
				playlist_id = playlist_id_arg
		);

		RETURN is_in_playlist;
	END
$$;
