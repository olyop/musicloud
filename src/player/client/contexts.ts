import { createContext } from "react"
import { SearchClient } from "algoliasearch"

export const AlgoliaSearchClient =
	createContext<SearchClient>(undefined!)