CREATE OR REPLACE FUNCTION
	add_album_to_playlist_return
	(album_id_arg uuid, playlist_id_arg uuid)
RETURNS
	TABLE (
		song_id uuid,
		mix text,
		title text,
		key_id uuid,
		bpm smallint,
		album_id uuid,
		duration smallint,
		disc_number smallint,
		track_number smallint
	)
LANGUAGE
	plpgsql
	VOLATILE
AS $$
	BEGIN
		PERFORM add_album_to_playlist(album_id_arg, playlist_id_arg);

		RETURN QUERY
			SELECT
				songs.song_id,
				songs.mix,
				songs.title,
				songs.key_id,
				songs.bpm,
				songs.album_id,
				songs.duration,
				songs.disc_number,
				songs.track_number
			FROM
				songs
			WHERE
				songs.album_id = album_id_arg
			ORDER BY
				songs.disc_number ASC,
				songs.track_number ASC;
	END;
$$;