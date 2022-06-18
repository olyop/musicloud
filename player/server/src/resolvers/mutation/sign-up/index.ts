import trim from "lodash-es/trim"
// eslint-disable-next-line node/no-missing-import
import { setTimeout } from "timers/promises"
import { UserInputError } from "apollo-server-errors"
import { convertFirstRowToCamelCase, join, query } from "@oly_op/pg-helpers"

import { Args } from "./types"
import resolver from "../resolver"
import { User } from "../../../types"
import { INSERT_USER } from "../../../sql"
import saveToAlogilia from "./save-to-algolia"
import { COLUMN_NAMES } from "../../../globals"
import { coverImages, profileImages } from "./images"
import { createJWT, emailAddressExists, hashPassword } from "../../helpers"
import { determineCover, determineProfile } from "./determine-images"
import { normalizeImageAndUploadToS3 } from "./normalize-image-and-upload-to-s3"

export const signUp =
	resolver<string, Args>(
		async ({ args, context }) => {
			const { input } = args

			const emailAddress =
				trim(input.emailAddress)

			const doesUserExists =
				await emailAddressExists(context.pg)({ emailAddress })

			if (doesUserExists) {
				throw new UserInputError("Email address already exists")
			}

			const name =
				trim(input.name)

			const password =
				await hashPassword(input)

			const user =
				await query(context.pg)(INSERT_USER)({
					parse: convertFirstRowToCamelCase<User>(),
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
					},{
						key: "columnNames",
						value: join(COLUMN_NAMES.USER),
					}],
				})

			const { userID } = user

			const cover =
				await determineCover({
					cover: input.cover,
				})

			const profile =
				await determineProfile({
					profile: input.profile,
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

			await setTimeout(3000)

			return createJWT(context.ag.client)(user)
		},
		{ global: false },
	)