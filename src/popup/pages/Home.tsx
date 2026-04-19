import { useState } from 'react'

import type { TmdbTvSearchShowBasic } from '../../api/getSeriesInfo'
import { SearchBar } from '../components/SearchBar'
import { ShowsList } from '../components/ShowsList'

import styles from './Home.module.css'

export function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<TmdbTvSearchShowBasic[] | null>(null)

  return (
    <div>
      <h1>Next Season Radar</h1>
      <p>Find out when your favorite TV series will release its next season.</p>
      <SearchBar
        onLoadingChange={setLoading}
        onSearchSuccess={(_payload, response) => {
          setError(null)
          setResults(response.results)
        }}
        onSearchError={(message) => {
          setError(message)
          setResults(null)
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

      {results !== null && results.length === 0 && !loading ? (
        <p className={styles.status}>No series found. Try another title.</p>
      ) : null}

      {results !== null && results.length > 0 ? (
        <ShowsList shows={results} />
      ) : null}
    </div>
  )
}
