import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"
import { NavLink, useLocation } from "react-router-dom"

import { ClassNameBEMPropTypes, OnClickPropTypes } from "../../types"

export const BarQueueButton: VFC =
	() => {
		const { pathname } = useLocation()
		return (
			<NavLink to="/queues">
				<Button
					title="Queue"
					icon="queue_music"
					transparent={pathname !== "/queues"}
				/>
			</NavLink>
		)
	}

export const BarExpandButton: VFC<BarExpandPropTypes> =
	({ onClick, className }) => (
		<Button
			transparent
			title="Player"
			onClick={onClick}
			icon="unfold_more"
			className={className}
		/>
	)

interface BarExpandPropTypes
	extends OnClickPropTypes, ClassNameBEMPropTypes {}