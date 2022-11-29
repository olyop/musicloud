CREATE OR REPLACE FUNCTION
	clear_queues
	(user_id_arg uuid)
RETURNS void
LANGUAGE plpgsql
VOLATILE
AS $$ BEGIN
	PERFORM clear_queue_previous(user_id_arg);
	PERFORM update_now_playing(user_id_arg);
	PERFORM clear_queue_next(user_id_arg);
	PERFORM clear_queue_later(user_id_arg);
	RETURN;
END $$;
