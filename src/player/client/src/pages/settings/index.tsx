import { createBEM } from "@oly_op/bem";
import { Head } from "@oly_op/react-head";
import toNumber from "lodash-es/toNumber";
import { ChangeEventHandler, createElement, FC } from "react";

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
} from "../../redux";

import Page from "../../layouts/page";
import Select from "../../components/select";
import { SettingsTheme, SettingsListStyle, SettingsTransitions } from "../../types";

import "./index.scss";

const bem = createBEM("SettingsPage");

const SettingsPage: FC = () => {
	const theme = useStateTheme();
	const dispatch = useDispatch();
	const listStyle = useStateListStyle();
	const showGenres = useStateShowGenres();
	const transitions = useStateTransitions();
	const showDuration = useStateShowDuration();
	const showReleased = useStateShowReleased();
	const gridChildWidth = useStateGridChildWidth();

	const handleToggleShowGenres = () => {
		dispatch(toggleShowGenres());
	};

	const handleToggleShowReleased = () => {
		dispatch(toggleShowReleased());
	};

	const handleToggleShowDuration = () => {
		dispatch(toggleShowDuration());
	};

	const handleThemeChange = (value: string) => {
		dispatch(updateTheme(value as SettingsTheme));
	};

	const handleListStyleChange = (value: string) => {
		dispatch(updateListStyle(value as SettingsListStyle));
	};

	const handleTransitionsChange = (value: string) => {
		dispatch(updateTransitions(value as SettingsTransitions));
	};

	const handleGridChildWidthChange: ChangeEventHandler<HTMLInputElement> = event => {
		dispatch(updateGridChildWidth(toNumber(event.target.value)));
	};

	return (
		<Head pageTitle="Settings">
			<Page>
				<div className="ContentPaddingTopBottom FlexColumnGap">
					<details open className={bem("details")}>
						<summary className={bem("summary", "HeadingSix MarginBottomHalf")}>Appearance</summary>
						<div className={bem("details-content", "FlexColumnGapHalf")}>
							<div className={bem("details-content-setting", "FlexColumnGapQuart")}>
								<p className="ParagraphTwoBold">Theme:</p>
								<Select
									value={theme}
									className="ParagraphTwo"
									onChange={handleThemeChange}
									options={Object.keys(SettingsTheme)}
								/>
							</div>
							<div className={bem("details-content-setting", "FlexColumnGapQuart")}>
								<p className="ParagraphTwoBold">List Style:</p>
								<Select
									value={listStyle}
									className="ParagraphTwo"
									onChange={handleListStyleChange}
									options={Object.keys(SettingsListStyle)}
								/>
							</div>
							<div className={bem("details-content-setting", "FlexColumnGapQuart")}>
								<p className="ParagraphTwoBold">Transitions:</p>
								<Select
									value={transitions}
									className="ParagraphTwo"
									onChange={handleTransitionsChange}
									options={Object.keys(SettingsTransitions)}
								/>
							</div>
							<div className={bem("details-content-setting", "FlexColumnGapQuart")}>
								<p className="ParagraphTwoBold">Grid Child Width:</p>
								<div className="FlexRowGapQuart">
									<p className="ParagraphTwo">{gridChildWidth}</p>
									<input
										min="100"
										max="300"
										type="range"
										className="ParagraphTwo"
										value={gridChildWidth}
										onChange={handleGridChildWidthChange}
									/>
								</div>
							</div>
						</div>
					</details>
					<details open className={bem("details")}>
						<summary className={bem("summary", "HeadingSix MarginBottomHalf")}>View</summary>
						<div className={bem("details-content", "FlexColumnGapHalf")}>
							<div className={bem("details-content-setting", "FlexColumnGapQuart")}>
								<p className="ParagraphTwoBold">Song Genres:</p>
								<div className="FlexRowGapFifth">
									<input
										type="checkbox"
										checked={showGenres}
										onChange={handleToggleShowGenres}
										className={bem("checkbox", "ParagraphTwo")}
									/>
									<p className="ParagraphTwo LightWeight">{showGenres ? "Show" : "Hide"}</p>
								</div>
							</div>
							<div className={bem("details-content-setting", "FlexColumnGapQuart")}>
								<p className="ParagraphTwoBold">Song Duration:</p>
								<div className="FlexRowGapFifth">
									<input
										type="checkbox"
										checked={showDuration}
										onChange={handleToggleShowDuration}
										className={bem("checkbox", "ParagraphTwo")}
									/>
									<p className="ParagraphTwo LightWeight">{showDuration ? "Show" : "Hide"}</p>
								</div>
							</div>
							<div className={bem("details-content-setting", "FlexColumnGapQuart")}>
								<p className="ParagraphTwoBold">Album Released:</p>
								<div className="FlexRowGapFifth">
									<input
										type="checkbox"
										className="Text"
										checked={showReleased}
										onChange={handleToggleShowReleased}
									/>
									<p className="ParagraphTwo LightWeight">{showReleased ? "Show" : "Hide"}</p>
								</div>
							</div>
						</div>
					</details>
				</div>
			</Page>
		</Head>
	);
};

export default SettingsPage;
