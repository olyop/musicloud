import { FC } from "react"
import { RouteComponentProps } from "react-router-dom"

import { QueueKeys } from "./unions"
import { Song, UserQueues, UserClientBase, UserNowPlaying } from "./objects"

export interface Disc {
	songs: Song[],
	number: number,
	hideLabel: boolean,
}

export interface Route {
	path: string,
	icon?: string,
	name?: string,
	exact?: boolean,
	routeID: string,
	ignore?: boolean,
	underline?: boolean,
	component: FC<RouteComponentProps>,
}

export interface Queue {
	name: string,
	songs: Song[],
	queueID: QueueKeys,
}

export type HandlerReturn = void | Promise<void>
export type Handler = () => HandlerReturn

export interface OnClickPropTypes {
	onClick?: Handler,
}

export interface UserQueuesExtracted extends
	UserQueues,
	UserClientBase {}

export interface UserQueuesNowPlayingExtracted extends
	UserQueues,
	UserClientBase,
	UserNowPlaying {}