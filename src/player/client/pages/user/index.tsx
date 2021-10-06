import { createElement, FC } from "react"
import { useParams } from "react-router-dom"
import Metadata from "@oly_op/react-metadata"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { ImageDimensions, ImageSizes, UserIDBase } from "@oly_op/music-app-common/types"

import { User } from "../../types"
import { useQuery } from "../../hooks"
import Banner from "../../components/banner"
import GET_USER_PAGE from "./get-user-page.gql"
import { determineCatalogImageURL } from "../../helpers"

const UserPage: FC = () => {
	const params = useParams<UserIDBase>()
	const userID = addDashesToUUID(params.userID)

	const { data } =
		useQuery<Data, UserIDBase>(GET_USER_PAGE, { variables: { userID } })

	return data ? (
		<Metadata title={data.user.name}>
			<Banner
				title={data.user.name}
				coverURL={determineCatalogImageURL(
					data.user.userID,
					"cover",
					ImageSizes.FULL,
					ImageDimensions.LANDSCAPE,
				)}
				profileURL={determineCatalogImageURL(
					data.user.userID,
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
	) : null
}

interface Data {
	user: User,
}

export default UserPage