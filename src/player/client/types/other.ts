import { PathRouteProps } from "react-router-dom"

import { Song } from "./objects"

export interface Disc {
	songs: Song[],
	number: number,
	hideLabel: boolean,
}

export interface Route extends PathRouteProps {
	icon?: string,
	name?: string,
	routeID: string,
	ignore?: boolean,
	underline?: boolean,
}

export type HandlerReturn = void | Promise<void>
export type Handler = () => HandlerReturn

export interface OnClickPropTypes {
	onClick?: Handler,
}

export interface OrderByOptions<T> {
	key: keyof T,
	fields: string[],
}