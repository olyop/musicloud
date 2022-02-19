import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"

const uploadClientURL =
	`http://127.0.0.1:${process.env.UPLOAD_CLIENT_PORT}`

const bem =
	createBEM("Authorization")

const AuthorizationFooter: VFC = () => (
	<a href={uploadClientURL} className={bem("footer", "Elevated")}>
		<Button
			transparent
			icon="arrow_back"
			text="Musicloud Upload"
			className={bem("footer-button")}
		/>
	</a>
)

export default AuthorizationFooter