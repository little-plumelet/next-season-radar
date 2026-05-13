import type { TmdbTvSearchShowBasic } from '../../../../api/getSeriesInfo'

import { cx } from '../../../utils/cx'
import styles from './ShowItem.module.css'

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
