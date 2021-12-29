CREATE TABLE IF NOT EXISTS users_followers (
	user_id uuid NOT NULL,
	follower_user_id uuid NOT NULL,
	date_followed bigint NOT NULL DEFAULT get_now(),
	CONSTRAINT users_followers_pk
		PRIMARY KEY (user_id, follower_user_id),
	CONSTRAINT users_followers_fk_user_id
		FOREIGN KEY (user_id)
		REFERENCES users (user_id) MATCH FULL
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT users_followers_fk_follower_user_id
		FOREIGN KEY (follower_user_id)
		REFERENCES users (user_id) MATCH FULL
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT users_followers_check_date_followed
		CHECK (date_followed <= get_now())
);