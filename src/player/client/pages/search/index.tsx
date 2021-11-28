import {
	VFC,
	useRef,
	useState,
	useEffect,
	createElement,
	ChangeEventHandler,
} from "react"

import isEmpty from "lodash/isEmpty"
import debounce from "lodash/debounce"
import uniqueID from "lodash/uniqueId"
import Image from "@oly_op/react-image"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import isUndefined from "lodash/isUndefined"
import Metadata from "@oly_op/react-metadata"
import { useLazyQuery } from "@apollo/client"
import { useNavigate, useLocation } from "react-router-dom"
import { BASE_S3_URL } from "@oly_op/music-app-common/globals"

import Search from "./search"
import determineID from "./determine-id"
import { useHasMounted } from "../../hooks"
import { Search as SearchType } from "../../types"
import GET_SEARCH_RESULTS from "./get-search-results.gql"
import { addLoading, useDispatch, removeLoading } from "../../redux"

import "./index.scss"

const bem =
	createBEM("SearchPage")

const SearchPage: VFC = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const dispatch = useDispatch()
	const queryID = useRef(uniqueID())
	const hasMounted = useHasMounted()

	const params = new URLSearchParams(location.search)
	const initQuery = params.get("query") ?? ""

	const [ input, setInput ] =
		useState(initQuery)

	const [ search, { data, loading } ] =
		useLazyQuery<GetSearchResultsData, GetSearchResultsVars>(GET_SEARCH_RESULTS)

	const delayedQuery =
		useRef(debounce<DelayedQuery>(
			value => search({ variables: { value, length: 30 } }),
			500,
		)).current

	const handleChange =
		(value: string) => {
			setInput(value)
			delayedQuery(value)
		}

	const handleClear =
		() => handleChange("")

	const handleInput: ChangeEventHandler<HTMLInputElement> =
		({ target: { value } }) =>
			handleChange(value)

	useEffect(() => {
		if (!isEmpty(initQuery)) {
			delayedQuery(initQuery)
		}
	}, [delayedQuery, initQuery])

	useEffect(() => {
		if (hasMounted) {
			const newParams = new URLSearchParams({ query: input })
			navigate({ search: newParams.toString() })
		}
	}, [input, history])

	useEffect(() => {
		if (loading) {
			dispatch(addLoading(queryID.current))
		} else {
			dispatch(removeLoading(queryID.current))
		}
	}, [loading, queryID, dispatch])

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
				{!isEmpty(input) && !isUndefined(data) && (
					<div className="Content Elevated">
						{data.getSearchResults.map(
							object => (
								<Search
									object={object}
									key={determineID(object)}
								/>
							),
						)}
					</div>
				)}
				<Image
					url={`${BASE_S3_URL}/logos/algolia.png`}
					className={bem("logo", "MarginTopBottom")}
				/>
			</section>
		</Metadata>
	)
}

type DelayedQuery =
	(x: string) => void

interface GetSearchResultsVars {
	value: string,
	length: number,
}

export interface GetSearchResultsData {
	getSearchResults: SearchType[],
}

export default SearchPage