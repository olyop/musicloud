import { sum, isEmpty } from "lodash-es";

import { Song } from "../../types";

export const getSongsDurationOrNull = (songs: Song[]) =>
	isEmpty(songs) ? null : sum(songs.map(({ duration }) => duration));
