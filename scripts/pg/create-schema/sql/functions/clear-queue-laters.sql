CREATE OR REPLACE FUNCTION
	clear_queue_laters
	(user_id_arg uuid)
RETURNS void
LANGUAGE plpgsql
VOLATILE
AS $$ BEGIN
	DELETE FROM
		queue_laters
	WHERE
		user_id = user_id_arg;
	RETURN;
END $$;
