import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import type { TmdbTvSearchShowBasic } from '../../api/getSeriesInfo'
import { getTvDetails } from '../../api/getTvDetails'
import type { SearchSuccessExtras } from '../components/SearchBar/ui/SearchBar'
import { ShowItemElaborate } from '../components/ShowItem'
import showsListStyles from '../components/ShowsList/ui/ShowsList.module.css'
import {
  tvDetailsToSearchExtras,
  tvDetailsToSearchShow,
} from '../utils/tvDetailsCard'

import styles from './ShowPage.module.css'

export function ShowPage() {
  const { id } = useParams<{ id: string }>()
  const seriesId = id != null ? Number.parseInt(id, 10) : Number.NaN

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [show, setShow] = useState<TmdbTvSearchShowBasic | null>(null)
  const [extras, setExtras] = useState<SearchSuccessExtras | null>(null)

  useEffect(() => {
    if (!Number.isFinite(seriesId) || seriesId <= 0) {
      setLoading(false)
      setError('Invalid show.')
      setShow(null)
      setExtras(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    void (async () => {
      try {
        const details = await getTvDetails(seriesId)
        if (cancelled) return
        if (!details) {
          setShow(null)
          setExtras(null)
          setError('Show not found.')
          return
        }
        setShow(tvDetailsToSearchShow(details))
        setExtras(tvDetailsToSearchExtras(details))
      } catch (e) {
        if (cancelled) return
        setShow(null)
        setExtras(null)
        setError(
          e instanceof Error ? e.message : 'Could not load this show.',
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [seriesId])

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={`${styles.status} ${styles.statusInfo}`} aria-live="polite">
          Loading…
        </p>
      </div>
    )
  }

  if (error || !show || !extras) {
    return (
      <div className={styles.page}>
        <p className={`${styles.status} ${styles.statusError}`} role="alert">
          {error ?? 'Something went wrong.'}
        </p>
        <Link className={styles.backLink} to="/">
          Back to search
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Link className={styles.backLink} to="/">
        Back to search
      </Link>
      <ul className={showsListStyles.results}>
        <ShowItemElaborate show={show} detailLayout extras={extras} />
      </ul>
    </div>
  )
}
