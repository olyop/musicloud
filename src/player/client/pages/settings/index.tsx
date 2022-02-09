import { createBEM } from "@oly_op/bem"
import toNumber from "lodash-es/toNumber"
import { Metadata } from "@oly_op/react-metadata"
import { ChangeEventHandler, createElement, VFC } from "react"

import {
	SettingsTheme,
	SettingsListStyle,
	SettingsTransitions,
} from "../../types"

import {
	useDispatch,
	updateTheme,
	useStateTheme,
	updateListStyle,
	toggleShowGenres,
	updateTransitions,
	useStateListStyle,
	useStateShowGenres,
	toggleShowReleased,
	toggleShowDuration,
	useStateTransitions,
	useStateShowDuration,
	useStateShowReleased,
	updateGridChildWidth,
	useStateGridChildWidth,
} from "../../redux"

import Select from "../../components/select"

import "./index.scss"

const bem =
	createBEM("SettingsPage")

const SettingsPage: VFC = () => {
	const theme = useStateTheme()
	const dispatch = useDispatch()
	const listStyle = useStateListStyle()
	const showGenres = useStateShowGenres()
	const transitions = useStateTransitions()
	const showDuration = useStateShowDuration()
	const showReleased = useStateShowReleased()
	const gridChildWidth = useStateGridChildWidth()

	const handleToggleShowGenres =
		() => {
			dispatch(toggleShowGenres())
		}

	const handleToggleShowReleased =
		() => {
			dispatch(toggleShowReleased())
		}

	const handleToggleShowDuration =
		() => {
			dispatch(toggleShowDuration())
		}

	const handleThemeChange =
		(value: string) => {
			dispatch(updateTheme(value as SettingsTheme))
		}

	const handleListStyleChange =
		(value: string) => {
			dispatch(updateListStyle(value as SettingsListStyle))
		}

	const handleTransitionsChange =
		(value: string) => {
			dispatch(updateTransitions(value as SettingsTransitions))
		}

	const handleGridChildWidthChange: ChangeEventHandler<HTMLInputElement> =
		event => {
			dispatch(updateGridChildWidth(toNumber(event.target.value)))
		}

	return (
		<Metadata title="Settings">
			<div className={bem("", "Content PaddingTopBottom")}>
				<h1 className="HeadingThree MarginBottom">
					Settings
				</h1>
				<div className="FlexColumnGap">
					<details open className={bem("details")}>
						<summary className={bem("summary", "HeadingSix MarginBottomHalf")}>
							Appearance
						</summary>
						<div className={bem("details-content", "FlexColumnGapHalf")}>
							<div className={bem("details-content-setting", "FlexColumnGapQuart")}>
								<p className="BodyTwoBold">
									Theme:
								</p>
								<Select
									value={theme}
									onChange={handleThemeChange}
									className="BodyTwo"
									options={Object.keys(SettingsTheme)}
								/>
							</div>
							<div className={bem("details-content-setting", "FlexColumnGapQuart")}>
								<p className="BodyTwoBold">
									List Style:
								</p>
								<Select
									value={listStyle}
									onChange={handleListStyleChange}
									className="BodyTwo"
									options={Object.keys(SettingsListStyle)}
								/>
							</div>
							<div className={bem("details-content-setting", "FlexColumnGapQuart")}>
								<p className="BodyTwoBold">
									Transitions:
								</p>
								<Select
									value={transitions}
									onChange={handleTransitionsChange}
									className="BodyTwo"
									options={Object.keys(SettingsTransitions)}
								/>
							</div>
							<div className={bem("details-content-setting", "FlexColumnGapQuart")}>
								<p className="BodyTwoBold">
									Grid Child Width:
								</p>
								<div className="FlexRowGapQuart">
									<p className="BodyTwo">
										{gridChildWidth}
									</p>
									<input
										min="100"
										max="300"
										type="range"
										className="BodyTwo"
										value={gridChildWidth}
										onChange={handleGridChildWidthChange}
									/>
								</div>
							</div>
						</div>
					</details>
					<details open className={bem("details")}>
						<summary className={bem("summary", "HeadingSix MarginBottomHalf")}>
							View
						</summary>
						<div className={bem("details-content", "FlexColumnGapHalf")}>
							<div className={bem("details-content-setting", "FlexColumnGapQuart")}>
								<p className="BodyTwoBold">
									Song Genres:
								</p>
								<div className="FlexRowGapFifth">
									<input
										type="checkbox"
										checked={showGenres}
										onChange={handleToggleShowGenres}
										className={bem("checkbox", "BodyTwo")}
									/>
									<p className="BodyTwo LightWeight">
										{showGenres ? "Show" : "Hide"}
									</p>
								</div>
							</div>
							<div className={bem("details-content-setting", "FlexColumnGapQuart")}>
								<p className="BodyTwoBold">
									Song Duration:
								</p>
								<div className="FlexRowGapFifth">
									<input
										type="checkbox"
										checked={showDuration}
										onChange={handleToggleShowDuration}
										className={bem("checkbox", "BodyTwo")}
									/>
									<p className="BodyTwo LightWeight">
										{showDuration ? "Show" : "Hide"}
									</p>
								</div>
							</div>
							<div className={bem("details-content-setting", "FlexColumnGapQuart")}>
								<p className="BodyTwoBold">
									Album Released:
								</p>
								<div className="FlexRowGapFifth">
									<input
										type="checkbox"
										className="Text"
										checked={showReleased}
										onChange={handleToggleShowReleased}
									/>
									<p className="BodyTwo LightWeight">
										{showReleased ? "Show" : "Hide"}
									</p>
								</div>
							</div>
						</div>
					</details>
				</div>
			</div>
		</Metadata>
	)
}

export default SettingsPage