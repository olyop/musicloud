import {
	DateResolver as Date,
	EmailAddressResolver as EmailAddress,
	NonEmptyStringResolver as NonEmptyString,
	NonNegativeIntResolver as NonNegativeInt,
	PositiveIntResolver as PositiveInt,
	TimestampResolver as TimeStamp,
	UUIDResolver as UUID,
	VoidResolver as Void,
} from "graphql-scalars";

import * as Album from "./album/index.js";
import * as Artist from "./artist/index.js";
import * as Genre from "./genre/index.js";
import * as Library from "./library/index.js";
import * as Mutation from "./mutation/index.js";
import * as Play from "./play/index.js";
import * as Playlist from "./playlist/index.js";
import * as Query from "./query/index.js";
import * as Queue from "./queue/index.js";
import * as Song from "./song/index.js";
import * as User from "./user/index.js";

const resolvers = {
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
};

export default resolvers;
