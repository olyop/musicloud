import trim from "lodash-es/trim"
import { hash, genSalt } from "bcrypt"
import { UserID } from "@oly_op/music-app-common/types"
import { convertFirstRowToCamelCase, query } from "@oly_op/pg-helpers"

import { Args } from "./types"
import resolver from "../resolver"
import { createJWT } from "../../helpers"
import { INSERT_USER } from "../../../sql"
import saveToAlogilia from "./save-to-algolia"
import { coverImages, profileImages } from "./images"
import { determineCover, determineProfile } from "./determine-images"
import { normalizeImageAndUploadToS3 } from "./normalize-image-and-upload-to-s3"

export const signUp =
	resolver<string, Args>(
		async ({ args, context }) => {
			const { input } = args

			const name =
				trim(input.name)

			const emailAddress =
				trim(input.emailAddress)

			const password =
				await hash(
					input.password,
					await genSalt(),
				)

			const cover =
				await determineCover({
					cover: input.cover,
				})

			const profile =
				await determineProfile({
					profile: input.profile,
				})

			console.log({
				name,
				emailAddress,
				password,
				cover,
				profile,
			})

			if (process.env.NODE_ENV === "development") {
				throw new Error("")
			}

			const { userID } =
				await query(context.pg)(INSERT_USER)({
					parse: convertFirstRowToCamelCase<UserID>(),
					variables: [{
						key: "name",
						value: name,
						parameterized: true,
					},{
						key: "password",
						value: password,
						parameterized: true,
					},{
						key: "emailAddress",
						value: emailAddress,
						parameterized: true,
					}],
				})

			await normalizeImageAndUploadToS3(context.s3)({
				buffer: cover,
				objectID: userID,
				images: coverImages,
			})

			await normalizeImageAndUploadToS3(context.s3)({
				buffer: profile,
				objectID: userID,
				images: profileImages,
			})

			await saveToAlogilia(context.ag.index)({
				name,
				userID,
				emailAddress,
				image: profileImages[2]!,
			})

			return createJWT(context.ag.client)({ userID, name })
		},
	)