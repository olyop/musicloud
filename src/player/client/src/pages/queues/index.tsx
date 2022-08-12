import { Head } from "@oly_op/react-head"
import { createElement, FC } from "react"

import Queue from "./queue"
import Header from "./header"
import Page from "../../layouts/page"
import NowPlaying from "./now-playing"

import GET_QUEUE_NEXT from "./get-queue-next.gql"
import GET_QUEUE_LATER from "./get-queue-later.gql"
import GET_QUEUE_PREVIOUS from "./get-queue-previous.gql"

const Queues: FC = () => (
	<Head pageTitle="Queue">
		<Page header={<Header/>}>
			<div className="Content PaddingTopBottom">
				<div className="Elevated FlexColumn">
					<Queue
						name="Previous"
						queueKey="previous"
						query={GET_QUEUE_PREVIOUS}
					/>
					<NowPlaying/>
					<Queue
						name="Next"
						queueKey="next"
						query={GET_QUEUE_NEXT}
					/>
					<Queue
						name="Later"
						queueKey="later"
						query={GET_QUEUE_LATER}
					/>
				</div>
			</div>
		</Page>
	</Head>
)

export default Queues