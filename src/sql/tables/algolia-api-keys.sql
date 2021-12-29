CREATE TABLE IF NOT EXISTS algolia_api_keys (
	key text NOT NULL,
	user_id uuid NOT NULL,
	CONSTRAINT algolia_api_keys_pk
		PRIMARY KEY (key),
	CONSTRAINT algolia_api_keys_user_id
		FOREIGN KEY (user_id)
		REFERENCES users (user_id) MATCH FULL
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
);