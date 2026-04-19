import type { TmdbTvSearchShowBasic } from '../../../../api/getSeriesInfo'

import styles from './ShowItem.module.css'

const TMDB_POSTER_W92 = 'https://image.tmdb.org/t/p/w92'

export type ShowItemProps = {
  show: TmdbTvSearchShowBasic
}

export function ShowItem({ show }: ShowItemProps) {
  return (
    <li className={styles.result}>
      {show.poster_path ? (
        <img
          className={styles.poster}
          src={`${TMDB_POSTER_W92}${show.poster_path}`}
          alt=""
          width={46}
          height={69}
        />
      ) : (
        <div className={styles.poster} aria-hidden />
      )}
      <div className={styles.resultBody}>
        <p className={styles.resultTitle}>{show.name}</p>
        <p className={styles.resultMeta}>
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
