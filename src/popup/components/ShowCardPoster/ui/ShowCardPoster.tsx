import { cx } from '../../../utils/cx'
import { tmdbPosterUrl } from '../../../../utils/tmdbPosterUrl'

import styles from './ShowCardPoster.module.css'

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
          src={tmdbPosterUrl(posterPath) ?? ''}
          alt=""
          width={46}
          height={69}
        />
      ) : null}
    </div>
  )
}
