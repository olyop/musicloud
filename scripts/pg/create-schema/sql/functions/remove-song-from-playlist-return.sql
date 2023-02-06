CREATE OR REPLACE FUNCTION
	remove_song_from_playlist_and_return
	(index_arg integer, playlist_id_arg uuid)
RETURNS
	uuid
LANGUAGE
	plpgsql
	VOLATILE
AS $$
	DECLARE
		song_id uuid;
	BEGIN
		SELECT
			playlists_songs.song_id INTO song_id
		FROM
			playlists_songs
		WHERE
			index = index_arg AND
			playlist_id = playlist_id_arg;

		PERFORM remove_song_from_playlist(index_arg, playlist_id_arg);

		RETURN song_id;
	END
$$;
