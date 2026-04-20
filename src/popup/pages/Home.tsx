import { useState } from 'react'

import type { TmdbTvSearchShowBasic } from '../../api/getSeriesInfo'
import type { TmdbTvEpisodeAir } from '../../api/getTvDetails'
import { SearchBar } from '../components/SearchBar'
import { ShowItem } from '../components/ShowItem'
import { ShowsList } from '../components/ShowsList'
import showsListStyles from '../components/ShowsList/ui/ShowsList.module.css'

import styles from './Home.module.css'

export function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<TmdbTvSearchShowBasic[] | null>(null)
  /** Next episode when single-match TV details include `next_episode_to_air`. */
  const [nextEpisodeFromDetails, setNextEpisodeFromDetails] = useState<
    TmdbTvEpisodeAir | undefined
  >(undefined)

  return (
    <div>
      <h1>Next Season Radar</h1>
      <p>Find out when your favorite TV series will release its next season.</p>
      <SearchBar
        onLoadingChange={setLoading}
        onSearchSuccess={(_payload, response, extras) => {
          setError(null)
          setResults(response.results)
          setNextEpisodeFromDetails(extras?.nextEpisode)
        }}
        onSearchError={(message) => {
          setError(message)
          setResults(null)
          setNextEpisodeFromDetails(undefined)
        }}
      />

      {loading && (
        <p className={styles.status} aria-live="polite">
          Searching…
        </p>
      )}

      {error ? (
        <p className={`${styles.status} ${styles.statusError}`} role="alert">
          {error}
        </p>
      ) : null}

      {results && results.length === 0 && !loading ? (
        <p className={styles.status}>No series found. Try another title.</p>
      ) : null}

      {results && results.length === 1 ? (
        <ul className={showsListStyles.results}>
          <ShowItem
            show={results[0]}
            detailLayout
            nextEpisode={nextEpisodeFromDetails}
          />
        </ul>
      ) : null}

      {results && results.length > 1 ? <ShowsList shows={results} /> : null}
    </div>
  )
}
