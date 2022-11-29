SELECT
  {{ columnNames }}
FROM
  albums_artists
JOIN
  artists
  ON
    albums_artists.artist_id = artists.artist_id
WHERE
  album_id = {{ albumID }}
ORDER BY
  index ASC;