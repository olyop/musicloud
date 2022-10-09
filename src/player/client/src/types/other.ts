import { HTMLAttributes } from "react";
import { NavLinkProps, PathRouteProps } from "react-router-dom";
import { BEMInput as BaseBEMInput } from "@oly_op/bem";

import { Song, Artist, Playlist } from "./objects";

export interface Disc {
	songs: Song[];
	index: number;
	hideLabel: boolean;
}

export interface Route extends PathRouteProps, Omit<NavLinkProps, "children" | "to" | "path"> {
	path: string;
	icon?: string;
	name?: string;
	routeID: string;
	ignore?: boolean;
	underline?: boolean;
}
export type Handler = () => void;

export interface OnClickPropTypes {
	onClick?: Handler;
}

export interface OrderByOptions<T> {
	key: keyof T;
	fields: string[];
}

export type ClassNamePropTypes = Pick<HTMLAttributes<unknown>, "className">;

type BEMInput = BaseBEMInput | ClassNamePropTypes["className"];

export interface ClassNameBEMPropTypes {
	className?: BEMInput;
}

export type InLibraryObjects = Song | Artist | Playlist;

export interface ObjectShowIcon {
	showIcon?: boolean;
}
