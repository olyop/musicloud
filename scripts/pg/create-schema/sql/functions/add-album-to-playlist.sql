CREATE OR REPLACE FUNCTION
	add_album_to_playlist
	(album_id_arg uuid, playlist_id_arg uuid)
RETURNS
	void
LANGUAGE
	plpgsql
STABLE
AS $$
	DECLARE
		album_song record;
	BEGIN
		FOR album_song IN
			SELECT
				song_id
			FROM
				songs
			WHERE
				album_id = album_id_arg
			ORDER BY
				disc_number ASC,
				track_number ASC
		LOOP
			PERFORM add_song_to_playlist(album_song.song_id, playlist_id_arg);
		END LOOP;
	END
$$;