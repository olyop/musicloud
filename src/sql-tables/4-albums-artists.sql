CREATE TABLE IF NOT EXISTS albums_artists (
  album_id uuid,
  artist_id uuid,
  index smallint,
  CONSTRAINT albums_artists_pk
    PRIMARY KEY (album_id, artist_id, index),
  CONSTRAINT albums_artists_fk_album_id
    FOREIGN KEY (album_id)
    REFERENCES albums (album_id) MATCH FULL
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT albums_artists_fk_artist_id
    FOREIGN KEY (artist_id)
    REFERENCES artists (artist_id) MATCH FULL
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT albums_artists_check_index
    CHECK (index >= 0)
);