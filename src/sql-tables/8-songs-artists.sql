CREATE TABLE IF NOT EXISTS songs_artists (
  song_id uuid,
  artist_id uuid,
  index smallint,
  CONSTRAINT songs_artists_pk
    PRIMARY KEY (song_id, artist_id, index),
  CONSTRAINT songs_artists_fk_artist_id
    FOREIGN KEY (artist_id)
    REFERENCES artists (artist_id) MATCH FULL
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
  CONSTRAINT songs_artists_fk_song_id
    FOREIGN KEY (song_id)
    REFERENCES songs (song_id) MATCH FULL
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT songs_artists_check_index
    CHECK (index >= 0)
);