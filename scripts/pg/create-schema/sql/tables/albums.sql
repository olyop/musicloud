CREATE TABLE IF NOT EXISTS albums (
	title text NOT NULL,
	album_id uuid DEFAULT gen_random_uuid(),
	released bigint NOT NULL DEFAULT get_now(),
	CONSTRAINT albums_pk
		PRIMARY KEY (album_id),
	CONSTRAINT albums_check_released
		CHECK (released <= current_date)
);