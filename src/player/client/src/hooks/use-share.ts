import { useState } from "react"
import { ServicesNames } from "@oly_op/musicloud-common/build/types"
import { determineServiceURL } from "@oly_op/musicloud-common/build/determine-service-url"

export const useShare =
	() => {
		const [ text, setText ] = useState<string | null>(null)

		const handler =
			(data: ShareData) => {
				if ("share" in navigator) {
					void navigator.share(data)
				} else if ("clipboard" in navigator && data.url) {
					const serviceURL = determineServiceURL({ service: ServicesNames.PLAYER })
					void navigator.clipboard.writeText(`${serviceURL.slice(0, -1)}${data.url}`)
					setText("Copied")
				} else {
					setText("Disabled")
				}
			}

		return [
			handler,
			text,
		] as const
	}