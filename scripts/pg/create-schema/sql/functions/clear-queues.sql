CREATE OR REPLACE FUNCTION
	clear_queues
	(user_id_arg uuid)
RETURNS void
LANGUAGE plpgsql
VOLATILE
AS $$ BEGIN
	PERFORM clear_queue_previous(user_id_arg);
	PERFORM handle_now_playing(user_id_arg);
	PERFORM clear_queue_nexts(user_id_arg);
	PERFORM clear_queue_laters(user_id_arg);
	RETURN;
END $$;
