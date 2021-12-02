import { createElement, VFC } from "react"
import { useParams } from "react-router-dom"
import Metadata from "@oly_op/react-metadata"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { ImageDimensions, ImageSizes, UserID } from "@oly_op/music-app-common/types"

import { User } from "../../types"
import { useQuery } from "../../hooks"
import Banner from "../../components/banner"
import GET_USER_PAGE from "./get-user-page.gql"
import { determineCatalogImageURL } from "../../helpers"

const UserPage: VFC = () => {
	const params = useParams<keyof UserID>()
	const userID = addDashesToUUID(params.userID!)

	const { data, error } =
		useQuery<GetUserPageData, UserID>(GET_USER_PAGE, {
			variables: { userID },
		})

	if (error) {
		return (
			<h2 className="Content BodyOne PaddingTopBottom">
				{error.message === "Failed to fetch" ?
					error.message :
					"Album does not exist."}
			</h2>
		)
	} else if (data) {
		return (
			<Metadata title={data.getUserByID.name}>
				<Banner
					title={data.getUserByID.name}
					coverURL={determineCatalogImageURL(
						data.getUserByID.userID,
						"cover",
						ImageSizes.FULL,
						ImageDimensions.LANDSCAPE,
					)}
					profileURL={determineCatalogImageURL(
						data.getUserByID.userID,
						"profile",
						ImageSizes.HALF,
						ImageDimensions.SQUARE,
					)}
				/>
				<div className="Content PaddingTopBottom">
					<p className="BodyOne">
						WIP.
					</p>
				</div>
			</Metadata>
		)
	} else {
		return null
	}
}

interface GetUserPageData {
	getUserByID: User,
}

export default UserPage