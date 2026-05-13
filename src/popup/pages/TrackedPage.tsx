import { useEffect, useState } from 'react'

import { getTrackedShows, type TrackedShow } from '../../storage/trackedShows'
import { EmptyRadarIcon } from '../components/icons/EmptyRadarIcon.tsx'
import { TrackedShowItem } from '../components/TrackedShowItem'

import styles from './TrackedPage.module.css'

function EmptyState() {
  return (
    <div className={styles.empty}>
      <EmptyRadarIcon className={styles.emptyIcon} />
      <p className={styles.emptyText}>Nothing to Track</p>
    </div>
  )
}

export function TrackedPage() {
  const [shows, setShows] = useState<TrackedShow[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void getTrackedShows()
      .then(setShows)
      .catch(() => setError('Could not load tracked shows.'))
      .finally(() => setLoaded(true))
  }, [])

  function handleRemoved(id: number) {
    setShows((prev) => prev.filter((s) => s.id !== id))
  }

  if (!loaded) return null

  return (
    <div className={styles.page}>
      {error ? (
        <p className={styles.error} role="alert">{error}</p>
      ) : shows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={styles.listScroll}>
          <ul className={styles.list}>
            {shows.map((show) => (
              <TrackedShowItem
                key={show.id}
                show={show}
                onRemoved={handleRemoved}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
