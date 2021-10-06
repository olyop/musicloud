CREATE TABLE IF NOT EXISTS songs_featurings (
  song_id uuid,
  artist_id uuid,
  index smallint,
  CONSTRAINT songs_featurings_pk
    PRIMARY KEY (song_id, artist_id, index),
  CONSTRAINT songs_featurings_fk_artist_id
    FOREIGN KEY (artist_id)
    REFERENCES artists (artist_id) MATCH FULL
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT songs_featurings_fk_song_id
    FOREIGN KEY (song_id)
    REFERENCES songs (song_id) MATCH FULL
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT songs_featurings_check_index
    CHECK (index >= 0)
);