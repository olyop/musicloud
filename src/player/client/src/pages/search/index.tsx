import {
	FC,
	useRef,
	useState,
	useEffect,
	createElement,
	ChangeEventHandler,
} from "react"

import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { Head } from "@oly_op/react-head"
import { AlgoliaRecord } from "@oly_op/musicloud-common"
import { isEmpty, uniqueId as uniqueID } from "lodash-es"
import algoliasearch, { SearchIndex } from "algoliasearch/lite"
import { useSearchParams, useNavigate } from "react-router-dom"

import { Hit } from "./types"
import SearchHit from "./hit"
import Page from "../../components/page"
import AlgoliaLogo from "./algolia-logo"
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

const SearchPage: FC = () => {
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
				process.env.ALGOLIA_SEARCH_INDEX_NAME,
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
		<Head pageTitle="Search">
			<Page childrenClassName={bem("", "PaddingBottom")}>
				<div className="Content">
					<div className={bem("bar")}>
						<Button
							transparent
							icon="search"
							className={bem("bar-input-search")}
						/>
						<input
							// eslint-disable-next-line jsx-a11y/no-autofocus
							autoFocus
							value={input}
							onChange={handleInput}
							placeholder="Search..."
							className={bem("bar-input", "PaddingHalf")}
						/>
						<div className={bem("bar-input-right", "FlexRowGapQuartCenter")}>
							{isEmpty(input) || (
								<Button
									transparent
									icon="close"
									onClick={handleClear}
									className={bem("bar-input-right-close")}
								/>
							)}
							<AlgoliaLogo/>
						</div>
					</div>
					{!isEmpty(input) && !isEmpty(hits) && (
						<div className="Elevated MarginTop">
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
				</div>
			</Page>
		</Head>
	)
}

export default SearchPage