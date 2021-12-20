import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"
import isUndefined from "lodash/isUndefined"
import { useParams } from "react-router-dom"
import { Metadata } from "@oly_op/react-metadata"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { GenreID } from "@oly_op/music-app-common/types"

import { useQuery } from "../../hooks"
import Songs from "../../components/songs"
import { useStateOrderBy } from "../../redux"
import GET_GENRE_PAGE from "./get-genre-page.gql"
import { Genre, SongsOrderBy, SongsOrderByField } from "../../types"

import "./index.scss"

const bem =
	createBEM("GenrePage")

const GenrePage: FC = () => {
	const params = useParams<keyof GenreID>()
	const genreID = addDashesToUUID(params.genreID!)
	const songsOrderBy = useStateOrderBy<SongsOrderByField>("songs")

	const { data, error } =
		useQuery<GetGenrePageData, GetGenrePageVars>(
			GET_GENRE_PAGE,
			{ variables: { songsOrderBy, genreID } },
		)

	if (!isUndefined(error)) {
		return (
			<h2 className="Content BodyOne PaddingTopBottom">
				{error.message === "Failed to fetch" ?
					error.message :
					"Genre does not exist."}
			</h2>
		)
	} else if (!isUndefined(data)) {
		return (
			<Metadata title={data.getGenreByID.name}>
				<h1
					children={data.getGenreByID.name}
					className={bem("", "HeadingFour MarginTopBottom PaddingTopBottom")}
				/>
				<Songs
					hideIndex
					songs={data.getGenreByID.songs}
					className="Content MarginBottom"
					orderBy={{ key: "songs", fields: Object.keys(SongsOrderByField) }}
				/>
			</Metadata>
		)
	} else {
		return null
	}
}

interface GetGenrePageData {
	getGenreByID: Genre,
}

interface GetGenrePageVars extends GenreID {
	songsOrderBy: SongsOrderBy,
}

export default GenrePage