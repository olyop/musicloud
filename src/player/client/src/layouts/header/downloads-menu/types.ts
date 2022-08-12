import { Dispatch, SetStateAction } from "react"

import { Song } from "../../../types"

export type Status =
	[number, number]

export type SetStatus =
	Dispatch<SetStateAction<Status | null>>

export type SetCurrentDownload =
	Dispatch<SetStateAction<Song | null>>