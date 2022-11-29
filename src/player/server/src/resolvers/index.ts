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

import * as Album from "./album";
import * as Artist from "./artist";
import * as Genre from "./genre";
import * as Library from "./library";
import * as Mutation from "./mutation";
import * as Play from "./play";
import * as Playlist from "./playlist";
import * as Query from "./query";
import * as Queue from "./queue";
import * as Song from "./song";
import * as User from "./user";

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
