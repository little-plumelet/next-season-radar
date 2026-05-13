import { cx } from '../../../utils/cx'

import styles from './ShowCardPoster.module.css'

const TMDB_POSTER_W92 = 'https://image.tmdb.org/t/p/w92'

const variantClass = {
  default: undefined,
  fill: styles.posterFrameFill,
  compact: styles.posterFrameCompact,
} as const

export type ShowCardPosterProps = {
  posterPath: string | null
  variant?: keyof typeof variantClass
}

export function ShowCardPoster({ posterPath, variant = 'default' }: ShowCardPosterProps) {
  return (
    <div
      className={cx(styles.posterFrame, variantClass[variant])}
      aria-hidden={posterPath ? undefined : true}
    >
      {posterPath ? (
        <img
          className={styles.posterImg}
          src={`${TMDB_POSTER_W92}${posterPath}`}
          alt=""
          width={46}
          height={69}
        />
      ) : null}
    </div>
  )
}
