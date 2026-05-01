import { useState } from 'react'

import type { TmdbTvSearchShowBasic } from '../../api/getSeriesInfo'
import { SearchBar } from '../components/SearchBar'
import { ShowsList } from '../components/ShowsList'

import styles from './Home.module.css'

export function Home() {
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<TmdbTvSearchShowBasic[] | null>(null)

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <header className={styles.introHeader}>
          <h2>Next Season Radar</h2>
          <span>
            Find out when your favorite TV series will release its next season.
          </span>
        </header>
        <SearchBar
          onLoadingChange={(isLoading) => {
            if (isLoading) {
              setResults(null)
              setError(null)
            }
          }}
          onSearchSuccess={(_payload, response) => {
            setError(null)
            setResults(response.results)
          }}
          onSearchError={(message) => {
            setError(message)
            setResults(null)
          }}
        />

        {error ? (
          <p className={`${styles.status} ${styles.statusError}`} role="alert">
            {error}
          </p>
        ) : null}

        {results && results.length === 0 ? (
          <p className={`${styles.status} ${styles.statusInfo}`}>
            No series found. Try another title.
          </p>
        ) : null}
      </div>

      {results && results.length > 0 ? (
        <div
          className={styles.resultsScroll}
          role="region"
          aria-label="Search results"
        >
          <ShowsList shows={results} />
        </div>
      ) : null}
    </div>
  )
}
