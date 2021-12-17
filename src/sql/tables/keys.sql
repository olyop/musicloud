CREATE TABLE IF NOT EXISTS keys (
	flat text NOT NULL,
	sharp text NOT NULL,
	camelot text NOT NULL,
	key_id uuid DEFAULT gen_random_uuid(),
	CONSTRAINT keys_pk
		PRIMARY KEY (key_id)
);