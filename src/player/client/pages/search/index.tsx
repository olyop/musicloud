import {
	VFC,
	useRef,
	useState,
	useEffect,
	useContext,
	createElement,
	ChangeEventHandler,
} from "react"

import isEmpty from "lodash/isEmpty"
import uniqueID from "lodash/uniqueId"
import { createBEM } from "@oly_op/bem"
import Image from "@oly_op/react-image"
import Button from "@oly_op/react-button"
import { SearchIndex } from "algoliasearch"
import { Metadata } from "@oly_op/react-metadata"
import { useLocation, useNavigate } from "react-router-dom"
import { AlgoliaRecord } from "@oly_op/music-app-common/types"

import { Hit } from "./types"
import SearchHit from "./hit"
import { useHasMounted } from "../../hooks"
import { AlgoliaSearchClient } from "../../contexts"
import { addLoading, removeLoading, useDispatch } from "../../redux"

import "./index.scss"

const loadingID =
	uniqueID()

const bem =
	createBEM("SearchPage")

const getAlgoliaHits =
	(index: SearchIndex) =>
		async (value: string) => {
			const { hits } =
				await index.search<AlgoliaRecord>(value)
			return hits
		}

const SearchPage: VFC = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const dispatch = useDispatch()
	const hasMounted = useHasMounted()
	const ag = useContext(AlgoliaSearchClient)

	const indexRef =
		useRef(ag.initIndex(process.env.ALGOLIA_INDEX_NAME))

	const params = new URLSearchParams(location.search)
	const initQuery = params.get("query") ?? ""

	const [ input, setInput ] =
		useState(initQuery)

	const [ hits, setHits ] =
		useState<Hit[]>([])

	const handleChange =
		async (value: string) => {
			setInput(value)
			dispatch(addLoading(loadingID))
			setHits(await getAlgoliaHits(indexRef.current)(input))
			dispatch(removeLoading(loadingID))
		}

	const handleClear =
		() => {
			setInput("")
			setHits([])
		}

	const handleInput: ChangeEventHandler<HTMLInputElement> =
		event =>
			handleChange(event.target.value)

	useEffect(() => {
		if (!isEmpty(initQuery)) {
			void getAlgoliaHits(indexRef.current)(initQuery).then(setHits)
		}
	}, [initQuery])

	useEffect(() => {
		if (hasMounted) {
			const newParams = new URLSearchParams({ query: input })
			navigate({ search: newParams.toString() })
		}
	}, [input, history])

	return (
		<Metadata title="Search">
			<section className={bem("")}>
				<div className={bem("bar", "Content PaddingTop")}>
					<input
						autoFocus
						value={input}
						onChange={handleInput}
						placeholder="Search..."
						className={bem("bar-input")}
						style={{ textAlign: isEmpty(input) ? "center" : "left" }}
					/>
					{isEmpty(input) || (
						<Button
							transparent
							icon="close"
							onClick={handleClear}
							className={bem("bar-input-close")}
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
					href="https://www.algolia.com"
				>
					<Image
						url="/search-by-algolia.png"
						className={bem("logo", "MarginTopBottom")}
					/>
				</a>
			</section>
		</Metadata>
	)
}

export default SearchPage