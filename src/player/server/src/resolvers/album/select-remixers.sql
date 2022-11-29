SELECT
  {{ columnNames }}
FROM
  albums_remixers
JOIN
  artists
  ON
    albums_remixers.artist_id = artists.artist_id
WHERE
  album_id = {{ albumID }}
ORDER BY
  index ASC;