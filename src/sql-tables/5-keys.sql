CREATE TABLE IF NOT EXISTS keys (
	key_id uuid,
	flat text NOT NULL,
	sharp text NOT NULL,
	camelot text NOT NULL,
	CONSTRAINT keys_pk
		PRIMARY KEY (key_id)
);