CREATE TABLE IF NOT EXISTS artists (
	city text,
	country text,
	name text NOT NULL,
	artist_id uuid DEFAULT gen_random_uuid(),
	CONSTRAINT artists_pk
		PRIMARY KEY (artist_id)
);