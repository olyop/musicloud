import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { FC, createElement } from "react";

import { useMutation, useResetPlayer } from "../../../hooks";
import {
	collapseQueuesDisclosure,
	expandQueuesDisclosure,
	useDispatch,
	useStateQueuesDisclosure,
} from "../../../redux";
import { Queue, QueueLater, QueueNext, QueueNextLater } from "../../../types";
import CLEAR_NEXT_QUEUES from "./clear-next-queues.gql";
import CLEAR_QUEUES from "./clear-queues.gql";
import "./index.scss";
import SHUFFLE_NEXT from "./shuffle-next-and-later.gql";
import WRITE_QUEUE from "./write-queue.gql";

const bem = createBEM("QueuesHeader");

const QueuesHeader: FC = () => {
	const dispatch = useDispatch();
	const resetPlayer = useResetPlayer();
	const queuesDisclosure = useStateQueuesDisclosure();

	const [shuffleNext] = useMutation<ShuffleNextData>(SHUFFLE_NEXT);

	const [clearNext] = useMutation<ClearNextQueuesData>(CLEAR_NEXT_QUEUES, {
		optimisticResponse: {
			clearNextQueues: {
				next: [],
				later: [],
				__typename: "Queue",
			},
		},
	});

	const [clear] = useMutation<ClearQueuesData>(CLEAR_QUEUES, {
		optimisticResponse: {
			clearQueues: {
				next: [],
				later: [],
				previous: [],
				nowPlaying: null,
				__typename: "Queue",
			},
		},
		update: (cache, result) => {
			if (result.data?.clearQueues) {
				cache.writeQuery<WriteQueue>({
					query: WRITE_QUEUE,
					data: {
						getQueue: result.data.clearQueues,
					},
				});
			}
		},
	});

	const handleExpandDisclosure = () => {
		dispatch(expandQueuesDisclosure());
	};

	const handleCollapseDisclosure = () => {
		dispatch(collapseQueuesDisclosure());
	};

	const handleShuffleNext = () => {
		void shuffleNext();
	};

	const handleClearNextQueues = () => {
		void clearNext();
		handleCollapseDisclosure();
	};

	const handleClearQueues = () => {
		void clear();
		dispatch(collapseQueuesDisclosure());
		resetPlayer();
	};

	const areQueuesCollapsed =
		queuesDisclosure.next || queuesDisclosure.later || queuesDisclosure.previous;

	return (
		<div className={bem("", "FlexRowGapHalf")}>
			<div className="FlexRowGapHalf">
				<Button icon="shuffle" text="Shuffle" onClick={handleShuffleNext} />
				<Button icon="clear_all" text="Clear Next" onClick={handleClearNextQueues} />
				<Button icon="close" text="Clear" onClick={handleClearQueues} />
			</div>
			<Button
				icon={areQueuesCollapsed ? "unfold_more" : "unfold_less"}
				onClick={areQueuesCollapsed ? handleCollapseDisclosure : handleExpandDisclosure}
			/>
		</div>
	);
};

interface WriteQueue {
	getQueue: Queue;
}

interface ClearQueuesData {
	clearQueues: Queue;
}

interface ShuffleNextData {
	shuffleNext: QueueNext & QueueLater;
}

interface ClearNextQueuesData {
	clearNextQueues: QueueNextLater;
}

export default QueuesHeader;
