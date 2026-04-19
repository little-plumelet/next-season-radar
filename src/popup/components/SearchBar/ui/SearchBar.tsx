import { useState } from 'react'
import type { FormEvent } from 'react'

import {
  getSeriesInfo,
  type TmdbTvSearchResponse,
} from '../../../../api/getSeriesInfo'
import styles from './SearchBar.module.css'

export type SearchBarSubmitPayload = {
  seriesName: string
  seasonNumber: number
}

type SearchBarProps = {
  /** Fired after TMDB search succeeds (same submit). */
  onSearchSuccess?: (
    payload: SearchBarSubmitPayload,
    response: TmdbTvSearchResponse,
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
  const [seasonNumber, setSeasonNumber] = useState<number | ''>('')
  const [searching, setSearching] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (seriesName.trim() === '' || seasonNumber === '' || searching) {
      return
    }

    const payload: SearchBarSubmitPayload = {
      seriesName: seriesName.trim(),
      seasonNumber: Number(seasonNumber),
    }

    setSearching(true)
    onLoadingChange?.(true)
    try {
      const response = await getSeriesInfo(payload.seriesName)
      onSearchSuccess?.(payload, response)
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
        <span className={styles.label}>Series name</span>
        <input
          type="text"
          name="seriesName"
          value={seriesName}
          onChange={(e) => setSeriesName(e.target.value)}
          placeholder="e.g. The Bear"
          autoComplete="off"
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Season number</span>
        <input
          type="number"
          name="seasonNumber"
          min={1}
          step={1}
          value={seasonNumber}
          onChange={(e) => {
            const v = e.target.value
            if (v === '') {
              setSeasonNumber('')
              return
            }
            const n = Number(v)
            if (!Number.isNaN(n)) setSeasonNumber(n)
          }}
          placeholder="1"
        />
      </label>
      <button
        type="submit"
        disabled={
          seriesName.trim() === '' || seasonNumber === '' || searching
        }
      >
        {searching ? 'Searching…' : 'Search'}
      </button>
    </form>
  )
}
