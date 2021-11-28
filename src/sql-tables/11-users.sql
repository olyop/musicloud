CREATE TABLE IF NOT EXISTS users (
	user_id uuid,
	name text NOT NULL,
	password text NOT NULL,
	date_joined bigint NOT NULL DEFAULT cast(extract(epoch from now()) as bigint),
	CONSTRAINT users_pk
		PRIMARY KEY (user_id)
);