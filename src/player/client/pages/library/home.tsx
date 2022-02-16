import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { Metadata } from "@oly_op/react-metadata"

const LibraryHome: VFC = () => {
	const { logout, loginWithRedirect, user } = useAuth0()
	const handleLogOut = () => logout()
	const handleLogIn = () => loginWithRedirect()
	return (
		<Metadata title="Library">
			<div className="Content FlexColumnGap">
				<h2 className="BodyTwo">
					W.I.P.
				</h2>
				<Button
					icon="login"
					text="Log In"
					onClick={handleLogIn}
				/>
				<Button
					icon="logout"
					text="Log Out"
					onClick={handleLogOut}
				/>
				<pre className="BodyTwo">
					{JSON.stringify(user, undefined, 2)}
				</pre>
			</div>
		</Metadata>
	)
}

export default LibraryHome