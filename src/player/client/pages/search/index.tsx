/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import uniqueID from "lodash/uniqueId"
import { Link } from "react-router-dom"
import { createElement, VFC } from "react"
import Metadata from "@oly_op/react-metadata"
import { connectSearchBox, connectHits, Highlight } from "react-instantsearch-dom"

import Item from "../../components/item"
import { determineObjectPath } from "../../helpers"
import TextField from "../../components/text-field"
import { usePlaySong } from "../../hooks"

const determineHitIcon =
	(typeName: string) => {
		switch (typeName) {
			case "Genre":
				return "list"
			case "Album":
				return "album"
			case "Artist":
				return "person"
			case "User":
				return "person"
			case "Song":
				return "audiotrack"
			case "Playlist":
				return "queue_music"
			default:
				return "person"
		}
	}

const Hits =
	connectHits(
		({ hits }) => (
			<div className="Elevated MarginTop">
				{hits.map(
					hit => {
						if (hit.typeName === "Song") {
							const [ playSong, isPlaying ] = usePlaySong({ songID: hit.objectID })
							return (
								<Item
									key={hit.objectID}
									className="PaddingHalf ItemBorder"
									leftIcon={determineHitIcon(hit.typeName)}
									style={{ paddingLeft: "var(--space-quart)" }}
									imageOptions={{
										url: hit.image,
										title: hit.text,
									}}
									playOptions={{
										isPlaying,
										onClick: playSong,
									}}
									infoOptions={{
										upperLeft: (
											<Highlight
												hit={hit}
												tagName="mark"
												attribute="name"
											/>
										),
										lowerLeft: (
											<Highlight
												hit={hit}
												tagName="mark"
												attribute="text"
											/>
										),
									}}
								/>
							)
						} else {
							return (
								<Link
									key={hit.objectID}
									className="ItemBorder"
									style={{ display: "block" }}
									to={determineObjectPath(hit.typeName.toLowerCase(), hit.objectID)}
								>
									<Item
										className="PaddingHalf"
										leftIcon={determineHitIcon(hit.typeName)}
										style={{ paddingLeft: "var(--space-quart)" }}
										imageOptions={
											hit.typeName === "Genre" ? undefined : {
												url: hit.image,
												title: hit.text,
											}
										}
										infoOptions={{
											upperLeft: (
												<Highlight
													hit={hit}
													tagName="mark"
													attribute="name"
												/>
											),
											lowerLeft: (
												<Highlight
													hit={hit}
													tagName="mark"
													attribute="text"
												/>
											),
										}}
									/>
								</Link>
							)
						}
					},
				)}
			</div>
		),
	)

const fieldID =
	uniqueID()

const SearchBox =
	connectSearchBox(
		({ refine, currentRefinement }) => (
			<TextField
				autoFocus
				name="Value"
				onChange={refine}
				fieldID={fieldID}
				placeholder="Search..."
				value={currentRefinement}
			/>
		),
	)

const SearchPage: VFC = () => (
	<Metadata title="Search">
		<section className="Content PaddingTopBottom BodyTwo">
			<SearchBox/>
			<div className="Elevated MarginTop">
				<Hits/>
			</div>
		</section>
	</Metadata>
)

export default SearchPage