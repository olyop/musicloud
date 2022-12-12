CREATE OR REPLACE FUNCTION
	shuffle_next_and_later
	(user_id_arg uuid)
RETURNS
	void
LANGUAGE
	plpgsql
VOLATILE
AS $$ BEGIN
	PERFORM shuffle_next(user_id_arg);
	PERFORM shuffle_later(user_id_arg);
END $$;
