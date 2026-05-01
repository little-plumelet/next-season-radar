import { useState } from 'react'
import type { FormEvent } from 'react'

import {
  getSeriesInfo,
  type TmdbTvSearchResponse,
} from '../../../../api/getSeriesInfo'
import {
  getTvDetails,
  type TmdbTvEpisodeAir,
} from '../../../../api/getTvDetails'
import { tvDetailsToSearchExtras } from '../../../utils/tvDetailsCard'
import styles from './SearchBar.module.css'

export type SearchBarSubmitPayload = {
  seriesName: string
}

export type SearchSuccessExtras = {
  /** Set when TMDB lists a next episode to air; omit when unknown or none. */
  nextEpisode?: TmdbTvEpisodeAir
  lastEpisode?: TmdbTvEpisodeAir
  numberOfSeasons: number
  inProduction: boolean
  status: 'Ended' | 'Returning Series' | 'Canceled' | 'Unknown'
}

type SearchBarProps = {
  /** Fired after TMDB search succeeds (same submit). Third arg is set only when search returns exactly one show (details fetched). */
  onSearchSuccess?: (
    payload: SearchBarSubmitPayload,
    response: TmdbTvSearchResponse,
    extras?: SearchSuccessExtras,
  ) => void
  onSearchError?: (message: string) => void
  onLoadingChange?: (loading: boolean) => void
}

export function SearchBar({
  onSearchSuccess,
  onSearchError,
  onLoadingChange,
}: SearchBarProps) {
  const [seriesName, setSeriesName] = useState('')
  const [searching, setSearching] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (seriesName.trim() === '' || searching) {
      return
    }

    const payload: SearchBarSubmitPayload = {
      seriesName: seriesName.trim(),
    }

    setSearching(true)
    onLoadingChange?.(true)
    try {
      const response = await getSeriesInfo(payload.seriesName)

      let extras: SearchSuccessExtras | undefined
      if (response.results.length === 1) {
        const details = await getTvDetails(response.results[0].id)
        if (details) {
          extras = tvDetailsToSearchExtras(details)
        }
      }

      onSearchSuccess?.(payload, response, extras)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Search failed. Please try again.'
      onSearchError?.(message)
    } finally {
      setSearching(false)
      onLoadingChange?.(false)
    }
  }

  return (
    <form
      className={styles.root}
      onSubmit={(e) => {
        void handleSubmit(e)
      }}
    >
      <label className={styles.field}>
        <div className={styles.inputRow}>
          <input
            type="text"
            name="seriesName"
            value={seriesName}
            onChange={(e) => setSeriesName(e.target.value)}
            placeholder="Series name (e.g. The Bear)"
            autoComplete="off"
            aria-label="Series name"
          />
          <button
            className={styles.searchButton}
            type="submit"
            disabled={seriesName.trim() === '' || searching}
            aria-label={searching ? 'Searching series' : 'Search series'}
          >
            {searching ? (
              <span className={styles.searchingContent}>
                <span className={styles.spinner} aria-hidden="true" />
                <span>Search</span>
              </span>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </label>
    </form>
  )
}
