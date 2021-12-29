CREATE TABLE IF NOT EXISTS users (
	name text NOT NULL,
	password text NOT NULL,
	last_name text NOT NULL,
	user_id uuid DEFAULT gen_random_uuid(),
	date_joined bigint NOT NULL DEFAULT get_now(),
	CONSTRAINT users_pk
		PRIMARY KEY (user_id)
);