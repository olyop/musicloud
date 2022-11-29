CREATE OR REPLACE FUNCTION
	get_artist_album_ids
	(artist_id_arg uuid)
RETURNS
	TABLE (album_id uuid)
LANGUAGE
	plpgsql
STABLE
AS $$ BEGIN
	RETURN QUERY
		SELECT DISTINCT
			songs.album_id
		FROM
			get_artist_song_ids(artist_id_arg) AS artist_songs_ids
		JOIN
			songs
				ON artist_songs_ids.song_id = songs.song_id;
END $$;
