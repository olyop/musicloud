CREATE OR REPLACE FUNCTION
	handle_now_playing
	(user_id_arg uuid, song_id_arg uuid DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
VOLATILE
AS $$ BEGIN
	IF (song_id_arg IS NULL) THEN
		DELETE FROM
			now_playing
		WHERE
			user_id = user_id_arg;
	ELSE
		IF (EXISTS (SELECT 1 FROM now_playing WHERE user_id = user_id_arg)) THEN
			UPDATE
				now_playing
			SET
				song_id = song_id_arg
			WHERE
				user_id = user_id_arg;
		ELSE
			INSERT INTO
				now_playing (user_id, song_id)
			VALUES
				(user_id_arg, song_id_arg);
		END IF;
	END IF;
END $$;
