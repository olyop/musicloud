CREATE TABLE IF NOT EXISTS artists (
	artist_id uuid,
	name text NOT NULL,
	city text NOT NULL,
	country text NOT NULL,
	CONSTRAINT artists_pk
		PRIMARY KEY (artist_id)
);