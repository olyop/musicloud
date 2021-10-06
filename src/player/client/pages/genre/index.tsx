import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"
import isUndefined from "lodash/isUndefined"
import { useParams } from "react-router-dom"
import Metadata from "@oly_op/react-metadata"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { GenreIDBase } from "@oly_op/music-app-common/types"

import {
	Genre,
	SongsOrderBy,
	SongsOrderByField,
} from "../../types"

import { useQuery } from "../../hooks"
import Songs from "../../components/songs"
import { useStateOrderBy } from "../../redux"
import GET_GENRE_PAGE from "./get-genre-page.gql"

import "./index.scss"

const bem =
	createBEM("GenrePage")

const GenrePage: FC = () => {
	const params = useParams<GenreIDBase>()
	const genreID = addDashesToUUID(params.genreID)
	const songsOrderBy = useStateOrderBy<SongsOrderByField>("songs")

	const { data, error } =
		useQuery<Data, Vars>(
			GET_GENRE_PAGE,
			{ variables: { songsOrderBy, genreID } },
		)

	if (!isUndefined(error)) {
		return (
			<h2 className="Content BodyOne PaddingTopBottom">
				Genre does not exist.
			</h2>
		)
	} else if (!isUndefined(data)) {
		return (
			<Metadata title={data.genre.name}>
				<h1
					children={data.genre.name}
					className={bem("", "HeadingThree MarginTopBottom PaddingTopBottomDouble")}
				/>
				<Songs
					hideIndex
					orderByKey="songs"
					songs={data.genre.songs}
					className="Content MarginBottom"
					orderByFields={Object.keys(SongsOrderByField)}
				/>
			</Metadata>
		)
	} else {
		return null
	}
}

interface Data {
	genre: Genre,
}

interface Vars extends GenreIDBase {
	songsOrderBy: SongsOrderBy,
}

export default GenrePage