import {
	VFC,
	useRef,
	useState,
	useEffect,
	createElement,
	ChangeEventHandler,
} from "react"

import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { Metadata } from "@oly_op/react-metadata"
import { isEmpty, uniqueId as uniqueID } from "lodash-es"
import algoliasearch, { SearchIndex } from "algoliasearch/lite"
import { useSearchParams, useNavigate } from "react-router-dom"
import { AlgoliaRecord, FILES_URL } from "@oly_op/musicloud-common"

import { Hit } from "./types"
import SearchHit from "./hit"
import { useHasMounted, useJWTPayload } from "../../hooks"
import { addLoading, removeLoading, useDispatch } from "../../redux"

import "./index.scss"

const loadingID =
	uniqueID()

const bem =
	createBEM("SearchPage")

const getAlgoliaHits =
	(index: SearchIndex) =>
		async (value: string) => {
			const { hits } = await index.search<AlgoliaRecord>(value)
			return hits
		}

const SearchPage: VFC = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const hasMounted = useHasMounted()
	const { algoliaKey } = useJWTPayload()
	const [ searchParams ] = useSearchParams()

	const agClientRef =
		useRef(
			algoliasearch(
				process.env.ALGOLIA_APPLICATION_ID,
				algoliaKey,
			),
		)

	const agIndexRef =
		useRef(
			agClientRef.current.initIndex(
				process.env.ALGOLIA_INDEX_NAME,
			),
		)

	const initQuery =
		searchParams.get("query") ?? ""

	const [ input, setInput ] =
		useState(initQuery)

	const [ hits, setHits ] =
		useState<Hit[]>([])

	const handleChange =
		async (value: string) => {
			setInput(value)
			dispatch(addLoading(loadingID))
			setHits(await getAlgoliaHits(agIndexRef.current)(input))
			dispatch(removeLoading(loadingID))
		}

	const handleClear =
		() => {
			setInput("")
			setHits([])
		}

	const handleInput: ChangeEventHandler<HTMLInputElement> =
		event => {
			void handleChange(event.target.value)
		}

	useEffect(() => {
		if (!isEmpty(initQuery)) {
			void getAlgoliaHits(agIndexRef.current)(initQuery).then(setHits)
		}
	}, [initQuery])

	useEffect(() => {
		if (hasMounted) {
			if (isEmpty(input)) {
				navigate("/search")
			} else {
				const querySearchParams =
					new URLSearchParams({ query: input })
				navigate({
					search: querySearchParams.toString(),
				})
			}
		}
	}, [input])

	return (
		<Metadata title="Search">
			<section className="FlexColumnGap PaddingTopBottom">
				<div className={bem("bar", "Content")}>
					<Button
						transparent
						icon="search"
						className={bem("bar-input-search", "bar-input-icon")}
					/>
					<input
						value={input}
						onChange={handleInput}
						placeholder="Search..."
						className={bem("bar-input", "PaddingHalf")}
					/>
					{isEmpty(input) || (
						<Button
							transparent
							icon="close"
							onClick={handleClear}
							className={bem("bar-input-close", "bar-input-icon")}
						/>
					)}
				</div>
				{!isEmpty(input) && !isEmpty(hits) && (
					<div className="Content Elevated">
						{hits.map(
							hit => (
								<SearchHit
									hit={hit}
									key={hit.objectID}
								/>
							),
						)}
					</div>
				)}
				<a
					target="_blank"
					rel="noreferrer"
					href="https://algolia.com"
					className={bem("algolia")}
					children={(
						<img
							alt="Search by Algolia"
							src={`${FILES_URL}/search-by-algolia.svg`}
							className={bem("algolia-image", "PaddingHalf Rounded")}
						/>
					)}
				/>
			</section>
		</Metadata>
	)
}

export default SearchPage