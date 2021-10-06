import { Pool } from "pg"
import { JwtPayload } from "jsonwebtoken"
import { SearchIndex } from "algoliasearch"
import { S3Client } from "@aws-sdk/client-s3"
import { UserIDBase } from "@oly_op/music-app-common/types"

import {
	User,
	Song,
	Genre,
	Album,
	Artist,
	Playlist,
	QueueSong,
	UserNowPlaying,
} from "./objects"

export interface OrderBy {
	field: string,
	direction: string,
}

export interface Context {
	pg: Pool,
	s3: S3Client,
	ag: SearchIndex,
	authorization: JWTPayload | undefined | null,
}

export interface ResolverParameter<P, A> {
	args: A,
	parent: P,
	context: Context,
}

export interface QueuesNowPlaying extends UserNowPlaying {
	queueNext: QueueSong[],
	queueLater: QueueSong[],
	queuePrevious: QueueSong[],
}

export type Search =
	User | Song | Genre | Album | Artist | Playlist

export interface JWTPayload
	extends UserIDBase, JwtPayload {}