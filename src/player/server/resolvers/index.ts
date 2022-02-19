import {
	JWTResolver as JWT,
	UUIDResolver as UUID,
	DateResolver as Date,
	VoidResolver as Void,
	TimestampResolver as TimeStamp,
	PositiveIntResolver as PositiveInt,
	EmailAddressResolver as EmailAddress,
	NonNegativeIntResolver as NonNegativeInt,
	NonEmptyStringResolver as NonEmptyString,
} from "graphql-scalars"

import * as Play from "./play"
import * as User from "./user"
import * as Song from "./song"
import * as Genre from "./genre"
import * as Album from "./album"
import * as Queue from "./queue"
import * as Query from "./query"
import * as Artist from "./artist"
import * as Library from "./library"
import * as Playlist from "./playlist"
import * as Mutation from "./mutation"

const resolvers = {
	JWT,
	Date,
	Void,
	UUID,
	Play,
	User,
	Song,
	Queue,
	Query,
	Genre,
	Album,
	Artist,
	Library,
	Mutation,
	Playlist,
	TimeStamp,
	PositiveInt,
	EmailAddress,
	NonNegativeInt,
	NonEmptyString,
}

export default resolvers