import { HTMLAttributes } from "react"
import { PathRouteProps } from "react-router-dom"
import { BEMInput as BaseBEMInput } from "@oly_op/bem"

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

export type ClassNamePropTypes =
	Pick<HTMLAttributes<unknown>, "className">

type BEMInput =
	BaseBEMInput | ClassNamePropTypes["className"]

export interface ClassNameBEMPropTypes {
	className?: BEMInput,
}