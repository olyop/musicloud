import { isUndefined } from "lodash-es"
import { createElement, FC } from "react"
import { useParams } from "react-router-dom"
import { GenreID } from "@oly_op/musicloud-common"
import { addDashesToUUID } from "@oly_op/uuid-dashes"

import { useQuery } from "../../hooks"
import Page from "../../components/page"
import Songs from "../../components/songs"
import { useStateOrderBy } from "../../redux"
import GET_GENRE_PAGE from "./get-genre-page.gql"
import { Genre, SongsOrderBy, SongsOrderByField } from "../../types"

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
			<Page
				pageTitle={data.getGenreByID.name}
				contentClassName="PaddingTopBottom"
				content={(
					<Songs
						hideIndex
						songs={data.getGenreByID.songs}
						className="Content "
						orderBy={{ key: "songs", fields: Object.keys(SongsOrderByField) }}
					/>
				)}
			/>
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