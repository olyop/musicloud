import {
	VFC,
	useRef,
	useState,
	useEffect,
	createElement,
	ChangeEventHandler,
} from "react"

import isEmpty from "lodash/isEmpty"
import uniqueID from "lodash/uniqueId"
import { createBEM } from "@oly_op/bem"
import Image from "@oly_op/react-image"
import Button from "@oly_op/react-button"
import { Metadata } from "@oly_op/react-metadata"
import { useLocation, useNavigate } from "react-router-dom"
import { AlgoliaRecord } from "@oly_op/music-app-common/types"

import Hit from "./hit"
import { searchIndex } from "../../algolia"
import { useHasMounted } from "../../hooks"
import { addLoading, removeLoading, useDispatch } from "../../redux"

import "./index.scss"

const bem =
	createBEM("SearchPage")

const getAlgoliaHits =
	async (value: string) => {
		const { hits } = await searchIndex.search<AlgoliaRecord>(value)
		return hits
	}

const SearchPage: VFC = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const dispatch = useDispatch()
	const loadingID = useRef(uniqueID())
	const hasMounted = useHasMounted()

	const params = new URLSearchParams(location.search)
	const initQuery = params.get("query") ?? ""

	const [ input, setInput ] =
		useState(initQuery)

	const [ hits, setHits ] =
		useState<AlgoliaRecord[]>([])

	const handleChange =
		async (value: string) => {
			setInput(value)
			dispatch(addLoading(loadingID.current))
			setHits(await getAlgoliaHits(input))
			dispatch(removeLoading(loadingID.current))
		}

	const handleClear =
		() => {
			setInput("")
			setHits([])
		}

	const handleInput: ChangeEventHandler<HTMLInputElement> =
		({ target: { value } }) =>
			handleChange(value)

	useEffect(() => {
		if (!isEmpty(initQuery)) {
			void getAlgoliaHits(initQuery).then(setHits)
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
								<Hit
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