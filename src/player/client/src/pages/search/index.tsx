import { createBEM } from "@oly_op/bem";
import { AlgoliaRecord } from "@oly_op/musicloud-common/build/types";
import Button from "@oly_op/react-button";
import { Head } from "@oly_op/react-head";
import algoliasearch, { SearchIndex } from "algoliasearch/lite";
import isEmpty from "lodash-es/isEmpty";
import uniqueID from "lodash-es/uniqueId";
import { ChangeEventHandler, FC, createElement, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useHasMounted, useJWTPayload } from "../../hooks";
import Page from "../../layouts/page";
import { addLoading, removeLoading, useDispatch } from "../../redux";
import AlgoliaLogo from "./algolia-logo";
import SearchHit from "./hit";
import "./index.scss";
import { Hit } from "./types";

const loadingID = uniqueID();

const bem = createBEM("SearchPage");

const getAlgoliaHits = (index: SearchIndex) => async (value: string) => {
	const { hits } = await index.search<AlgoliaRecord>(value);
	return hits;
};

const SearchPage: FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const hasMounted = useHasMounted();
	const { algoliaKey } = useJWTPayload();
	const [searchParams] = useSearchParams();

	const algoliaSearchIndex = useRef(
		algoliasearch(process.env.ALGOLIA_APPLICATION_ID, algoliaKey).initIndex(
			process.env.ALGOLIA_SEARCH_INDEX_NAME,
		),
	);

	const initQuery = searchParams.get("query") ?? "";

	const [input, setInput] = useState(initQuery);

	const [hits, setHits] = useState<Hit[]>([]);

	const handleChange = async (value: string) => {
		setInput(value);
		try {
			dispatch(addLoading(loadingID));
			const newHits = await getAlgoliaHits(algoliaSearchIndex.current)(input);
			setHits(newHits);
		} catch (error) {
			console.error(error);
		} finally {
			dispatch(removeLoading(loadingID));
		}
	};

	const handleClear = () => {
		setInput("");
		setHits([]);
	};

	const handleInput: ChangeEventHandler<HTMLInputElement> = event => {
		void handleChange(event.target.value);
	};

	useEffect(() => {
		if (!isEmpty(initQuery)) {
			getAlgoliaHits(algoliaSearchIndex.current)(initQuery)
				.then(setHits)
				.catch(console.error)
				.finally(console.error);
		}
	}, [initQuery]);

	useEffect(() => {
		if (hasMounted) {
			if (isEmpty(input)) {
				navigate("/search");
			} else {
				const querySearchParams = new URLSearchParams({ query: input });
				navigate({
					search: querySearchParams.toString(),
				});
			}
		}
	}, [input]);

	return (
		<Head pageTitle="Search">
			<Page childrenClassName={bem("", "PaddingBottom")}>
				<div className="Content">
					<div className={bem("bar")}>
						<Button transparent icon="search" className={bem("bar-input-search")} />
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
							<AlgoliaLogo />
						</div>
					</div>
					{!isEmpty(input) && !isEmpty(hits) && (
						<div className="Elevated MarginTop">
							{hits.map(hit => (
								<SearchHit hit={hit} key={hit.objectID} />
							))}
						</div>
					)}
				</div>
			</Page>
		</Head>
	);
};

export default SearchPage;
