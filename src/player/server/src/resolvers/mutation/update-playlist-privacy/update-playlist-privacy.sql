UPDATE
  playlists
SET
  privacy = {{ privacy }}
WHERE
  playlist_id = {{ playlistID }}
RETURNING
	{{ columnNames }};