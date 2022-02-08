import { HTMLAttributes } from "react"
import { PathRouteProps } from "react-router-dom"
import { BEMInput as BaseBEMInput } from "@oly_op/bem"

import { Song, Artist, Playlist } from "./objects"

export type PromiseOrValue<T> = T | Promise<T>

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

export type HandlerReturn = PromiseOrValue<void>
export type Handler = () => HandlerReturn

export type Callback = () => void
export type HandlerPromise = () => Promise<void>

export interface OnClickPropTypes {
	onClick?: Handler,
}

export interface OrderByOptions<T> {
	key: keyof T,
	fields: string[],
}

export type ClassNamePropTypes =
	Pick<HTMLAttributes<unknown>, "className">

type BEMInput =
	BaseBEMInput | ClassNamePropTypes["className"]

export interface ClassNameBEMPropTypes {
	className?: BEMInput,
}

export type InLibraryObjects =
	Song | Artist | Playlist

export interface ObjectShowIcon {
	showIcon?: boolean,
}