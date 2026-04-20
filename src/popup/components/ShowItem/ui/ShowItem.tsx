import type { TmdbTvSearchShowBasic } from '../../../../api/getSeriesInfo'
import type { TmdbTvEpisodeAir } from '../../../../api/getTvDetails'

import { NextEpisodeSection } from './NextEpisodeSection'

import styles from './ShowItem.module.css'

const TMDB_POSTER_W92 = 'https://image.tmdb.org/t/p/w92'

function cx(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ')
}

export type ShowItemProps = {
  show: TmdbTvSearchShowBasic
  /** Wider poster + spacing for the single-match row with TV details fetched. */
  detailLayout?: boolean
  /** Next episode when TMDB returned one; omit when none scheduled or unknown. */
  nextEpisode?: TmdbTvEpisodeAir
}

export function ShowItem({ show, nextEpisode, detailLayout }: ShowItemProps) {
  const expanded = Boolean(detailLayout)

  return (
    <li className={cx(styles.result, expanded && styles.resultWithNext)}>
      <div
        className={cx(
          styles.posterFrame,
          expanded && styles.posterFrameFill,
        )}
        aria-hidden={show.poster_path ? undefined : true}
      >
        {show.poster_path ? (
          <img
            className={styles.posterImg}
            src={`${TMDB_POSTER_W92}${show.poster_path}`}
            alt=""
            width={46}
            height={69}
          />
        ) : null}
      </div>
      <div className={styles.layout}>
        <p className={styles.resultTitle}>{show.name}</p>

        <NextEpisodeSection episode={nextEpisode} />

        <p
          className={cx(
            styles.resultMeta,
            expanded && styles.resultMetaMuted,
          )}
        >
          {show.first_air_date
            ? `First aired ${show.first_air_date}`
            : 'First air date unknown'}
          {show.vote_average > 0
            ? ` · ★ ${show.vote_average.toFixed(1)}`
            : null}
        </p>
      </div>
    </li>
  )
}
