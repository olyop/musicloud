import { createBEM } from "@oly_op/bem"
import { createElement, VFC } from "react"
import { Metadata } from "@oly_op/react-metadata"

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
} from "../../redux"

import Select from "../../components/select"
import { SettingsListStyle, SettingsTheme, SettingsTransitions } from "../../types"

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
							<div>
								<p className="BodyTwoBold MarginBottomQuart">
									Theme:
								</p>
								<Select
									value={theme}
									onChange={handleThemeChange}
									className="BodyTwo MarginRightQuart"
									options={Object.keys(SettingsTheme)}
								/>
							</div>
							<div>
								<p className="BodyTwoBold MarginBottomQuart">
									List Style:
								</p>
								<Select
									value={listStyle}
									onChange={handleListStyleChange}
									className="BodyTwo MarginRightQuart"
									options={Object.keys(SettingsListStyle)}
								/>
							</div>
							<div>
								<p className="BodyTwoBold MarginBottomQuart">
									Transitions:
								</p>
								<Select
									value={transitions}
									onChange={handleTransitionsChange}
									className="BodyTwo MarginRightQuart"
									options={Object.keys(SettingsTransitions)}
								/>
							</div>
						</div>
					</details>
					<details open className={bem("details")}>
						<summary className={bem("summary", "HeadingSix MarginBottomHalf")}>
							View
						</summary>
						<div className={bem("details-content", "FlexColumnGapHalf")}>
							<div>
								<p className="BodyTwoBold MarginBottomQuart">
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
							<div>
								<p className="BodyTwoBold MarginBottomQuart">
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
							<div>
								<p className="BodyTwoBold MarginBottomQuart">
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