import { useState } from 'react'

import {
  removeTrackedShow,
  type TrackedShow,
} from '../../../../storage/trackedShows'
import { ShowCardPoster } from '../../ShowCardPoster'

import styles from './TrackedShowItem.module.css'

export type TrackedShowItemProps = {
  show: TrackedShow
  onRemoved: (id: number) => void
}

export function TrackedShowItem({ show, onRemoved }: TrackedShowItemProps) {
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState(false)

  function handleRemove() {
    setRemoving(true)
    setError(false)
    removeTrackedShow(show.id).then(
      () => onRemoved(show.id),
      () => {
        setRemoving(false)
        setError(true)
      },
    )
  }

  return (
    <li className={styles.item}>
      <ShowCardPoster posterPath={show.poster_path} variant="compact" />
      <div className={styles.info}>
        <p className={styles.name}>{show.name}</p>
        {error ? (
          <p className={styles.removeError} role="alert">
            Failed to remove. Try again.
          </p>
        ) : null}
      </div>
      <button
        className={styles.removeBtn}
        type="button"
        onClick={handleRemove}
        disabled={removing}
      >
        {removing ? 'Removing…' : 'Remove'}
      </button>
    </li>
  )
}
