CREATE TABLE IF NOT EXISTS users (
	name text NOT NULL,
	password text NOT NULL,
	user_id uuid DEFAULT gen_random_uuid(),
	date_joined bigint NOT NULL DEFAULT cast(extract(epoch from now()) as bigint),
	CONSTRAINT users_pk
		PRIMARY KEY (user_id)
);