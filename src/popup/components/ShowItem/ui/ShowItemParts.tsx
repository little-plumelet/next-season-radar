import type { TmdbTvSearchShowBasic } from '../../../../api/getSeriesInfo'

import { TMDB_POSTER_W92, cx } from './showItemShared'
import styles from './ShowItem.module.css'

/** Poster frame + TMDB image for show result rows. */
export function ShowCardPoster({
  posterPath,
  fill,
}: {
  posterPath: TmdbTvSearchShowBasic['poster_path']
  fill?: boolean
}) {
  return (
    <div
      className={cx(styles.posterFrame, fill && styles.posterFrameFill)}
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

/** First air date + rating line shared by compact and elaborate cards. */
export function ShowCardAirRating({
  firstAirDate,
  voteAverage,
  detailLayout,
}: {
  firstAirDate: TmdbTvSearchShowBasic['first_air_date']
  voteAverage: TmdbTvSearchShowBasic['vote_average']
  detailLayout?: boolean
}) {
  return (
    <p
      className={cx(
        styles.resultMeta,
        detailLayout && styles.resultMetaMuted,
      )}
    >
      {firstAirDate ? `First aired ${firstAirDate}` : 'First air date unknown'}
      {voteAverage > 0 ? ` · ★ ${voteAverage.toFixed(1)}` : null}
    </p>
  )
}
