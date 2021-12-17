CREATE TABLE IF NOT EXISTS artists (
	name text NOT NULL,
	city text NOT NULL,
	country text NOT NULL,
	artist_id uuid DEFAULT gen_random_uuid(),
	CONSTRAINT artists_pk
		PRIMARY KEY (artist_id)
);